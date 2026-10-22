"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ChillinLogo from "@/components/ui/ChillinLogo";

/* ── Types ── */
interface WaitlistData {
  position: number;
  total: number;
  refCode: string;
  referralCount: number;
}

/* ── Suspense wrapper (required by Next.js for useSearchParams) ── */
export default function WaitlistPageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-ink flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-paper/20 border-t-sage rounded-full animate-spin" />
        </div>
      }
    >
      <WaitlistPageContent />
    </Suspense>
  );
}

/* ── Animation variants ── */
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
};

function WaitlistPageContent() {
  const ref = useSearchParams().get("ref");
  return <WaitlistDetails key={ref ?? "missing"} referralCode={ref} />;
}

function WaitlistDetails({ referralCode: ref }: { referralCode: string | null }) {

  const [data, setData] = useState<WaitlistData | null>(null);
  const [loading, setLoading] = useState(Boolean(ref));
  const [error, setError] = useState(ref ? "" : "No referral code found.");
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState("");
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const referralLink =
    typeof window !== "undefined" && ref
      ? `${window.location.origin}?ref=${encodeURIComponent(ref)}`
      : "";

  useEffect(() => {
    if (!ref) return;

    const controller = new AbortController();
    fetch(`/api/waitlist?ref=${encodeURIComponent(ref)}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((d) => {
        if (controller.signal.aborted) return;
        setData(d);
        setLoading(false);
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        setError("Couldn\u2019t find your spot. Try signing up again.");
        setLoading(false);
      });
    return () => controller.abort();
  }, [ref]);

  useEffect(() => () => { if (copyTimer.current) clearTimeout(copyTimer.current); }, []);

  async function copyLink() {
    if (!referralLink) return;
    setCopied(false);
    setCopyError("");
    if (copyTimer.current) clearTimeout(copyTimer.current);
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      copyTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopyError("Could not copy. Select and copy the invite link manually.");
    }
  }

  /* ── Loading state ── */
  if (loading) {
    return (
      <div role="status" aria-label="Loading your waitlist position" className="min-h-screen bg-ink flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-paper/20 border-t-sage rounded-full animate-spin" />
      </div>
    );
  }

  /* ── Error state ── */
  if (error || !data) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center text-center px-8">
        <div>
          <div className="mb-6">
            <ChillinLogo />
          </div>
          <h1 className="font-serif text-2xl font-bold text-paper mb-3">
            Hmm, something&apos;s off
          </h1>
          <p className="text-paper/50 mb-8">{error}</p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-cream text-ink font-semibold transition-all duration-300 hover:-translate-y-0.5"
          >
            Back to home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink text-paper overflow-hidden">
      {/* ── Nav ── */}
      <nav className="py-5 px-8 md:px-12">
        <div className="max-w-[900px] mx-auto flex items-center justify-between">
          <a href="/">
            <ChillinLogo />
          </a>
          <a
            href="/"
            className="text-sm text-paper/40 hover:text-paper transition-colors duration-200"
          >
            Back to home
          </a>
        </div>
      </nav>

      <motion.div
        className="max-w-[600px] mx-auto px-8 md:px-12 pt-8 pb-24"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* ── Header ── */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-sage/15 text-sm font-medium text-sage mb-8">
            <span className="w-2 h-2 rounded-full bg-[#5cb87a] animate-[pulse-dot_2s_ease-in-out_infinite]" />
            You&apos;re on the list
          </div>
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight text-paper mb-3">
            You&apos;re in. Now get comfy.
          </h1>
          <p className="text-base text-paper/50 leading-relaxed max-w-[440px] mx-auto">
            Founding member perks are locked in. We&apos;ll email you when access is ready.
          </p>
        </motion.div>

        {/* ── Rank Card ── */}
        <motion.div variants={itemVariants} className="mb-8">
          <div
            className="relative rounded-3xl overflow-hidden p-8 md:p-10 text-center"
            style={{
              background:
                "linear-gradient(135deg, rgba(74, 107, 90, 0.3) 0%, rgba(74, 107, 90, 0.08) 50%, rgba(196, 168, 130, 0.15) 100%)",
            }}
          >
            {/* Glow */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(74, 107, 90, 0.2), transparent 70%)",
              }}
            />

            <div className="relative z-[1]">
              <div className="text-xs font-semibold tracking-[0.15em] uppercase text-sage mb-4">
                Your Signup Position
              </div>
              <div className="font-serif text-6xl md:text-7xl lg:text-8xl font-extrabold text-paper mb-3 leading-none">
                #{data.position.toLocaleString()}
              </div>
              <div className="text-sm text-paper/40">
                out of{" "}
                <span className="text-paper/60 font-semibold">
                  {data.total.toLocaleString()}
                </span>{" "}
                people
              </div>
            </div>

            {/* Border decoration */}
            <div className="absolute inset-0 rounded-3xl border border-paper/[0.08]" />
          </div>
        </motion.div>

        {/* ── Boost Section ── */}
        <motion.div variants={itemVariants} className="mb-6">
          <h2 className="font-serif text-2xl font-bold text-paper mb-2 text-center">
            Share the waitlist
          </h2>
          <p className="text-sm text-paper/40 text-center mb-8">
            Invite friends who might like Chillin. Your signup position stays the same.
          </p>
        </motion.div>

        {/* ── Referral Card (primary) ── */}
        <motion.div variants={itemVariants} className="mb-4">
          <div className="rounded-2xl bg-sage/[0.12] border border-sage/20 p-6 md:p-7">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
              <div>
                <h3 className="font-serif text-lg font-bold text-paper mb-1">
                  Invite your friends
                </h3>
                <p className="text-sm text-paper/45">
                  Share your link to track signups from friends.
                </p>
              </div>
              <div className="text-sm font-semibold text-sage whitespace-nowrap">
                Invite link
              </div>
            </div>

            {/* Referral link + copy */}
            <div className="flex items-center gap-2">
              <input aria-label="Your invite link" readOnly value={referralLink} className="min-w-0 flex-1 px-4 py-3 rounded-xl bg-ink/40 border border-paper/[0.08] text-sm text-paper/80 font-mono" />
              <button
                onClick={copyLink}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-sage text-paper text-sm font-semibold transition-all duration-300 hover:bg-sage-dark hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(74,107,90,0.3)] whitespace-nowrap"
              >
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.span
                      key="copied"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-1.5"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Copied!
                    </motion.span>
                  ) : (
                    <motion.span
                      key="copy"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-1.5"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                      Copy link
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>

            <p role="status" className="text-sm mt-3 text-paper/80">{copied ? "Invite link copied." : copyError}</p>

            {/* Referral count */}
            {data.referralCount > 0 && (
              <div className="mt-4 text-xs text-sage font-medium">
                {data.referralCount} friend{data.referralCount === 1 ? "" : "s"} signed up through your link
              </div>
            )}
          </div>
        </motion.div>

        {/* ── Footer note ── */}
        <motion.div variants={itemVariants} className="mt-12 text-center">
          <p className="text-xs text-paper/25 leading-relaxed">
            Invites are counted when a friend joins the waitlist.
            <br />
            Founding members get 50% off for life. We mean it.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
