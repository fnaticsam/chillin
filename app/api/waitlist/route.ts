import { NextRequest, NextResponse } from "next/server";
import { createClient, type EdgeConfigClient } from "@vercel/edge-config";

export const dynamic = "force-dynamic";

/* ── Edge Config client (lazy, avoids build-time crash) ── */
let _edgeConfig: EdgeConfigClient | null = null;
function getEdgeConfig() {
  if (!_edgeConfig) {
    _edgeConfig = createClient(process.env.EDGE_CONFIG!);
  }
  return _edgeConfig;
}

/* ── Types ── */
interface WaitlistEntry {
  email: string;
  refCode: string;
  referredBy: string | null;
  position: number;
  createdAt: string;
}

function generateRefCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

/* ── Write helper: PATCH Edge Config via Vercel API ── */
async function writeEdgeConfig(
  items: { operation: string; key: string; value: unknown }[]
) {
  const ecId = process.env.EDGE_CONFIG_ID;
  const token = process.env.VERCEL_API_TOKEN;
  const teamId = process.env.VERCEL_TEAM_ID;

  const res = await fetch(
    `https://api.vercel.com/v1/edge-config/${ecId}/items?teamId=${teamId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items }),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Edge Config write failed: ${res.status} ${text}`);
  }
}

/* ── POST: Sign up for the waitlist ── */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = body.email?.trim()?.toLowerCase();
    const ref = body.ref?.trim() || null;

    if (!email || !email.includes("@") || !email.includes(".")) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // Check if already signed up
    const emailKey = `email_${email.replace(/[^a-z0-9]/g, "_")}`;
    const existingRefCode = await getEdgeConfig().get<string>(emailKey);

    if (existingRefCode) {
      const entry = await getEdgeConfig().get<WaitlistEntry>(
        `ref_${existingRefCode}`
      );
      const total = (await getEdgeConfig().get<number>("counter")) || 0;
      return NextResponse.json(
        {
          message: "You're already on the list! We'll be in touch soon.",
          alreadyExists: true,
          position: entry?.position || 1,
          refCode: existingRefCode,
          total,
        },
        { status: 200 }
      );
    }

    // Get current counter and increment
    const currentCount = (await getEdgeConfig().get<number>("counter")) || 0;
    const position = currentCount + 1;
    const refCode = generateRefCode();

    const newEntry: WaitlistEntry = {
      email,
      refCode,
      referredBy: ref,
      position,
      createdAt: new Date().toISOString(),
    };

    // Batch all writes into a single PATCH (1 write toward the daily limit)
    const items: { operation: string; key: string; value: unknown }[] = [
      { operation: "upsert", key: "counter", value: position },
      { operation: "upsert", key: `ref_${refCode}`, value: newEntry },
      { operation: "upsert", key: emailKey, value: refCode },
    ];

    // Track referral count if referred
    if (ref) {
      const refCountKey = `referrals_${ref}`;
      const currentRefCount =
        (await getEdgeConfig().get<number>(refCountKey)) || 0;
      items.push({
        operation: "upsert",
        key: refCountKey,
        value: currentRefCount + 1,
      });
    }

    await writeEdgeConfig(items);

    console.log(
      `[Waitlist] New signup: ${email} (ref: ${refCode}, position: #${position})`
    );

    return NextResponse.json(
      {
        message: "Welcome to the founding crew!",
        position,
        refCode,
        total: position,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[Waitlist] POST error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

/* ── GET: Lookup by ref code, or return total count ── */
export async function GET(req: NextRequest) {
  try {
    const ref = req.nextUrl.searchParams.get("ref");

    if (ref) {
      const entry = await getEdgeConfig().get<WaitlistEntry>(`ref_${ref}`);
      if (!entry) {
        return NextResponse.json(
          { error: "Referral code not found." },
          { status: 404 }
        );
      }

      const total = (await getEdgeConfig().get<number>("counter")) || 0;
      const referralCount =
        (await getEdgeConfig().get<number>(`referrals_${ref}`)) || 0;

      return NextResponse.json({
        position: entry.position,
        total,
        refCode: entry.refCode,
        referralCount,
      });
    }

    const count = (await getEdgeConfig().get<number>("counter")) || 0;
    return NextResponse.json({ count });
  } catch (err) {
    console.error("[Waitlist] GET error:", err);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
