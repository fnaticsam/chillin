import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

/* ── Types ── */
interface WaitlistEntry {
  email: string;
  refCode: string;
  referredBy: string | null;
  createdAt: string;
}

const DATA_FILE = path.join(process.cwd(), "waitlist.json");

function generateRefCode(): string {
  return crypto.randomBytes(4).toString("hex").toUpperCase(); // e.g. "A3F1BC09"
}

async function readWaitlist(): Promise<WaitlistEntry[]> {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(data);

    // Migrate from old format (string[]) to new format (WaitlistEntry[])
    if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === "string") {
      const migrated: WaitlistEntry[] = parsed.map((email: string) => ({
        email,
        refCode: generateRefCode(),
        referredBy: null,
        createdAt: new Date().toISOString(),
      }));
      await writeWaitlist(migrated);
      return migrated;
    }

    return parsed;
  } catch {
    return [];
  }
}

async function writeWaitlist(entries: WaitlistEntry[]): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(entries, null, 2), "utf-8");
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

    const entries = await readWaitlist();
    const existing = entries.find((e) => e.email === email);

    if (existing) {
      const position = entries.indexOf(existing) + 1;
      return NextResponse.json(
        {
          message: "You're already on the list! We'll be in touch soon.",
          alreadyExists: true,
          position,
          refCode: existing.refCode,
          total: entries.length,
        },
        { status: 200 }
      );
    }

    const refCode = generateRefCode();
    const newEntry: WaitlistEntry = {
      email,
      refCode,
      referredBy: ref,
      createdAt: new Date().toISOString(),
    };

    entries.push(newEntry);
    await writeWaitlist(entries);

    const position = entries.length;
    console.log(`[Waitlist] New signup: ${email} (ref: ${refCode}, position: #${position})`);

    return NextResponse.json(
      {
        message: "Welcome to the founding crew!",
        position,
        refCode,
        total: entries.length,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

/* ── GET: Lookup by ref code, or return total count ── */
export async function GET(req: NextRequest) {
  const entries = await readWaitlist();
  const ref = req.nextUrl.searchParams.get("ref");

  if (ref) {
    const entry = entries.find((e) => e.refCode === ref);
    if (!entry) {
      return NextResponse.json(
        { error: "Referral code not found." },
        { status: 404 }
      );
    }

    const position = entries.indexOf(entry) + 1;
    const referralCount = entries.filter((e) => e.referredBy === ref).length;

    return NextResponse.json({
      position,
      total: entries.length,
      refCode: entry.refCode,
      referralCount,
    });
  }

  return NextResponse.json({ count: entries.length });
}
