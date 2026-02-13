"use client";

import { Suspense, useEffect, useState } from "react";
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

/* ── Boost task data (visual only) ── */
const boostTasks = [
  {
    title: "Invite your friends",
    desc: "Every verified signup moves you up. No limits.",
    spots: "+30 spots / friend",
    type: "referral" as const,
    status: "active" as const,
  },
  {
    title: "Share on social media",
    desc: "Share your invite link. Take a screenshot. Upload to jump.",
    spots: "+100 spots",
    type: "social" as const,
    status: "available" as const,
  },
  {
    title: "Follow us on X",
    desc: "Stay in the loop. We post updates there first.",
    spots: "+50 spots",
    type: "follow" as const,
    status: "available" as const,
  },
];

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
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");

  const [data, setData] = useState<WaitlistData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const referralLink =
    typeof window !== "undefined" && ref
      ? `${window.location.origin}?ref=${ref}`
      : "";

  useEffect(() => {
    if (!ref) {
      setError("No referral code found.");
      setLoading(false);
      return;
    }

    fetch(`/api/waitlist?ref=${ref}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => {
        setError("Couldn\u2019t find your spot. Try signing up again.");
        setLoading(false);
      });
  }, [ref]);

  function copyLink() {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  /* ── Loading state ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center">
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
            Founding member perks are locked in. Move up the list and you&apos;ll
            get access sooner.
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
                Your Waitlist Rank
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
            Move up the list
          </h2>
          <p className="text-sm text-paper/40 text-center mb-8">
            Every little bit helps. The higher you are, the sooner you&apos;re in.
          </p>
        </motion.div>

        {/* ── Referral Card (primary) ── */}
        <motion.div variants={itemVariants} className="mb-4">
          <div className="rounded-2xl bg-sage/[0.12] border border-sage/20 p-6 md:p-7">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
              <div>
                <h3 className="font-serif text-lg font-bold text-paper mb-1">
                  {boostTasks[0].title}
                </h3>
                <p className="text-sm text-paper/45">
                  {boostTasks[0].desc}
                </p>
              </div>
              <div className="text-sm font-semibold text-sage whitespace-nowrap">
                {boostTasks[0].spots}
              </div>
            </div>

            {/* Referral link + copy */}
            <div className="flex items-center gap-2">
              <div className="flex-1 px-4 py-3 rounded-xl bg-ink/40 border border-paper/[0.08] text-sm text-paper/60 truncate font-mono">
                {referralLink || "loading..."}
              </div>
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

            {/* Referral count */}
            {data.referralCount > 0 && (
              <div className="mt-4 text-xs text-sage font-medium">
                {data.referralCount} friend{data.referralCount === 1 ? "" : "s"} signed up through your link
              </div>
            )}
          </div>
        </motion.div>

        {/* ── Other boost tasks (visual only) ── */}
        {boostTasks.slice(1).map((task) => (
          <motion.div key={task.title} variants={itemVariants} className="mb-4">
            <div className="rounded-2xl bg-paper/[0.04] border border-paper/[0.08] p-6 md:p-7 transition-all duration-300 hover:bg-paper/[0.06] hover:border-paper/[0.12]">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-serif text-base font-bold text-paper">
                      {task.title}
                    </h3>
                    <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-paper/[0.08] text-paper/40 uppercase tracking-wider">
                      Available
                    </span>
                  </div>
                  <p className="text-sm text-paper/40">{task.desc}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-warm whitespace-nowrap">
                    {task.spots}
                  </span>
                  <button className="px-5 py-2.5 rounded-xl bg-paper/[0.08] text-paper/60 text-sm font-semibold transition-all duration-300 hover:bg-paper/[0.12] hover:text-paper whitespace-nowrap">
                    Show details
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* ── Footer note ── */}
        <motion.div variants={itemVariants} className="mt-12 text-center">
          <p className="text-xs text-paper/25 leading-relaxed">
            Every friend who signs up bumps you up. No catch.
            <br />
            Founding members get 50% off for life. We mean it.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
