import { NextRequest, NextResponse } from "next/server";
import { createClient, type EdgeConfigClient } from "@vercel/edge-config";
import { createHash, randomBytes } from "node:crypto";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface WaitlistEntry {
  email: string;
  refCode: string;
  referredBy: string | null;
  position: number;
  createdAt: string;
}
type Item = { operation: "create" | "upsert"; key: string; value: unknown };
const REF_PATTERN = /^(?:[A-HJ-NP-Z2-9]{8}|[a-f0-9]{32})$/;
const MAX_BODY_BYTES = 2048;
let edgeConfig: EdgeConfigClient | undefined;
function reader() {
  return (edgeConfig ??= createClient(process.env.EDGE_CONFIG!));
}

class PublicError extends Error {
  constructor(readonly status: number, message: string) { super(message); }
}
function json(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...(status === 429 || status === 503 ? { "Retry-After": "60" } : {}) },
  });
}
function failure(error: unknown) {
  if (error instanceof PublicError) return json({ error: error.message }, error.status);
  // Never log request bodies, addresses, referral codes, upstream response bodies or tokens.
  console.error("[Waitlist] Storage request failed");
  return json({ error: "The waitlist is temporarily unavailable. Please try again." }, 503);
}

// A bounded per-instance burst guard, not a distributed client rate limiter.
const bursts = { read: { minute: 0, count: 0 }, write: { minute: 0, count: 0 } };
function burst(kind: keyof typeof bursts) {
  const minute = Math.floor(Date.now() / 60_000);
  const bucket = bursts[kind];
  if (bucket.minute !== minute) { bucket.minute = minute; bucket.count = 0; }
  if (++bucket.count > (kind === "write" ? 30 : 300)) {
    throw new PublicError(429, "Too many requests. Please try again shortly.");
  }
}
async function input(req: NextRequest) {
  if (req.headers.get("content-type")?.split(";")[0].trim() !== "application/json") {
    throw new PublicError(415, "Please send JSON.");
  }
  if (Number(req.headers.get("content-length")) > MAX_BODY_BYTES) {
    throw new PublicError(413, "Request is too large.");
  }
  const stream = req.body?.getReader();
  if (!stream) throw new PublicError(400, "Please send a valid signup.");
  let size = 0;
  const chunks: Uint8Array[] = [];
  try {
    while (true) {
      const { value, done } = await stream.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) {
        await stream.cancel();
        throw new PublicError(413, "Request is too large.");
      }
      chunks.push(value);
    }
  } finally { stream.releaseLock(); }
  let body: unknown;
  try { body = JSON.parse(Buffer.concat(chunks).toString("utf8")); }
  catch { throw new PublicError(400, "Please send valid JSON."); }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new PublicError(400, "Please send a valid signup.");
  }
  const { email: rawEmail, ref: rawRef } = body as Record<string, unknown>;
  const email = typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";
  const [local, domain] = email.split("@");
  if (email.length > 254 || !local || local.length > 64 || !domain ||
      !/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/.test(email) ||
      domain.split(".").some(part => part.length > 63)) {
    throw new PublicError(400, "Please enter a valid email address.");
  }
  const ref = typeof rawRef === "string" ? rawRef.trim() : rawRef;
  if (ref != null && ref !== "" && (typeof ref !== "string" || !REF_PATTERN.test(ref))) {
    throw new PublicError(400, "Please use a valid referral link.");
  }
  return { email, ref: (ref || null) as string | null };
}

// Read authoritative values for writes: the SDK may serve a stale replica.
// Keep the existing store/credentials; no provisioning or live migration is required.
async function management(path: string, init: RequestInit = {}) {
  const { EDGE_CONFIG_ID: id, VERCEL_API_TOKEN: token, VERCEL_TEAM_ID: team } = process.env;
  if (!id || !token) throw new Error("Missing storage configuration");
  const url = new URL(`https://api.vercel.com/v1/edge-config/${encodeURIComponent(id)}/${path}`);
  if (team) url.searchParams.set("teamId", team);
  return fetch(url, {
    ...init, cache: "no-store", signal: AbortSignal.timeout(5000),
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  });
}
async function current<T>(key: string): Promise<T | undefined> {
  const res = await management(`item/${encodeURIComponent(key)}`);
  if (res.status === 404) return undefined;
  if (!res.ok) throw new Error("Storage read failed");
  return (await res.json()).value as T;
}
function count(value: unknown): number {
  if (value === undefined) return 0;
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0 || value === Number.MAX_SAFE_INTEGER) {
    throw new Error("Invalid stored counter");
  }
  return value;
}
async function existing(email: string, key: string) {
  const code = await current<string>(key) ?? await current<string>(`email_${email.replace(/[^a-z0-9]/g, "_")}`);
  if (!code) return undefined;
  if (!REF_PATTERN.test(code)) throw new Error("Invalid stored reference");
  const entry = await current<WaitlistEntry>(`ref_${code}`);
  // Legacy keys are lossy. Never assign another address's record to this signup.
  return entry?.email === email ? entry : undefined;
}

export async function POST(req: NextRequest) {
  try {
    burst("write");
    const origin = req.headers.get("origin");
    if (origin && origin !== req.nextUrl.origin) throw new PublicError(403, "Please sign up from this site.");
    const { email, ref } = await input(req);
    const key = `email_v2_${createHash("sha256").update(email).digest("hex")}`;
    for (let attempt = 0; attempt < 4; attempt++) {
      // Read the counter BEFORE dependent values. The create-only position marker
      // serializes the whole batch across instances; a stale read cannot commit.
      const total = count(await current<number>("counter"));
      const entry = await existing(email, key);
      if (entry) return json({ message: "You're already on the list! We'll be in touch soon.", alreadyExists: true, position: entry.position, refCode: entry.refCode, total });
      const referredBy = ref ? await current<WaitlistEntry>(`ref_${ref}`) : undefined;
      if (ref && !referredBy) throw new PublicError(400, "Please use a valid referral link.");
      const referralCount = ref ? count(await current<number>(`referrals_${ref}`)) : 0;
      const day = new Date().toISOString().slice(0, 10);
      const budget = await current<{ day: string; count: number }>("waitlist_write_budget");
      const used = budget?.day === day ? count(budget.count) : 0;
      // A global successful-write ceiling bounds storage growth across instances.
      // This is a backstop, not bot detection; see docs/audit for remaining gates.
      if (used >= 1000) throw new PublicError(429, "Today's signup limit has been reached. Please try again tomorrow.");
      const position = total + 1;
      const refCode = randomBytes(16).toString("hex");
      const items: Item[] = [
        { operation: "create", key: `waitlist_position_${position}`, value: true },
        { operation: "create", key, value: refCode },
        { operation: "create", key: `ref_${refCode}`, value: { email, refCode, referredBy: ref, position, createdAt: new Date().toISOString() } },
        { operation: "upsert", key: "counter", value: position },
        { operation: "upsert", key: "waitlist_write_budget", value: { day, count: used + 1 } },
      ];
      if (ref) items.push({ operation: "upsert", key: `referrals_${ref}`, value: referralCount + 1 });
      const res = await management("items", { method: "PATCH", body: JSON.stringify({ items }) });
      if (res.ok) return json({ message: "Welcome to the founding crew!", position, refCode, total: position }, 201);
      // Vercel rejects the entire batch if a create already exists. Never retry a
      // transport error/5xx: its write outcome may be uncertain. Client retries are idempotent.
      if (res.status !== 400 && res.status !== 409) throw new Error("Storage write failed");
    }
    throw new PublicError(503, "The waitlist is busy. Please try again shortly.");
  } catch (error) { return failure(error); }
}

export async function GET(req: NextRequest) {
  try {
    burst("read");
    const ref = req.nextUrl.searchParams.get("ref");
    if (ref !== null) {
      if (!REF_PATTERN.test(ref)) throw new PublicError(400, "Please use a valid referral link.");
      const values = await reader().getAll([`ref_${ref}`, "counter", `referrals_${ref}`]);
      const entry = values[`ref_${ref}`] as unknown as WaitlistEntry | undefined;
      if (!entry) return json({ error: "Referral code not found." }, 404);
      return json({ position: entry.position, total: count(values.counter), refCode: entry.refCode, referralCount: count(values[`referrals_${ref}`]) });
    }
    return json({ count: count(await reader().get("counter")) });
  } catch (error) { return failure(error); }
}
