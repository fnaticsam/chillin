"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence, useReducedMotion } from "framer-motion";
import { useWaitlistSignup } from "@/components/ui/useWaitlistSignup";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
  },
};

/* ─── count-up helper ─── */
function CountUp({
  end,
  suffix = "",
  decimals = 0,
  duration = 2000,
  delay = 0,
}: {
  end: number;
  suffix?: string;
  decimals?: number;
  duration?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState("0" + suffix);

  useEffect(() => {
    if (!inView || reduceMotion) return;
    let frame = 0;
    const timeout = setTimeout(() => {
      const start = performance.now();
      const step = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = eased * end;
        setDisplay(value.toFixed(decimals) + suffix);
        if (progress < 1) frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    }, delay);
    return () => { clearTimeout(timeout); cancelAnimationFrame(frame); };
  }, [inView, end, suffix, decimals, duration, delay, reduceMotion]);

  return <span ref={ref}>{reduceMotion ? end.toFixed(decimals) + suffix : display}</span>;
}

/* ─── per-stat stagger variants ─── */
const statContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.25,
    },
  },
};

const statItemVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function Hero() {
  const { email, setEmail, status, setStatus, errorMsg, handleSubmit } = useWaitlistSignup();

  return (
    <section
      id="hero"
      className="relative bg-cream text-ink"
    >
      <motion.div
        className="relative z-[2] max-w-[1000px] mx-auto px-8 md:px-12 pt-40 md:pt-52 pb-28 md:pb-36 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-sage/10 border border-sage/20 text-sm font-medium text-sage mb-10"
        >
          <span className="w-2 h-2 rounded-full bg-[#5cb87a] animate-[pulse-dot_2s_ease-in-out_infinite]" />
          Life&apos;s too short for hold music
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="font-serif text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] mb-8 text-ink"
        >
          Someone else can sit
          <br className="hidden sm:block" />
          {" "}on hold{" "}
          <em className="italic bg-gradient-to-br from-sage to-[#7aad8e] bg-clip-text text-transparent">
            for once
          </em>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl leading-relaxed text-ink/55 mb-12 max-w-[560px] mx-auto"
        >
          Tell us what&apos;s wrong. A real human picks it up, sits through
          the hold music, and gets it sorted. You go do literally anything else.
        </motion.p>

        {/* ── Inline email capture ── */}
        <motion.div
          variants={itemVariants}
          className="relative inline-block w-full max-w-[560px] mb-20"
        >
          <div
            className="relative bg-white rounded-2xl p-2 shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-black/[0.06] transition-all duration-500 hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] hover:rotate-0"
            style={{ rotate: "-0.8deg" }}
          >
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  role="status"
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-3 px-8 py-4 text-sage font-semibold"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  You&apos;re in! Redirecting...
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="flex flex-col sm:flex-row items-stretch gap-2"
                >
                  <label htmlFor="hero-email" className="sr-only">Email address</label>
                  <input
                    id="hero-email"
                    name="email"
                    autoComplete="email"
                    maxLength={254}
                    aria-invalid={status === "error"}
                    aria-describedby={status === "error" ? "hero-email-error" : undefined}
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === "error") setStatus("idle");
                    }}
                    className="w-full min-w-0 sm:flex-1 px-5 py-3.5 rounded-xl bg-transparent text-ink placeholder:text-ink/30 text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-sage"
                    required
                    disabled={status === "loading"}
                  />
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-ink text-paper text-base font-semibold transition-all duration-300 hover:bg-ink/90 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(13,13,26,0.2)] disabled:opacity-60 disabled:hover:translate-y-0 whitespace-nowrap"
                  >
                    {status === "loading" ? (
                      <>
                        <span className="w-4 h-4 border-2 border-paper/30 border-t-paper rounded-full animate-spin" />
                        Hold on...
                      </>
                    ) : (
                      <>
                        I&apos;m in
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Error message */}
          <AnimatePresence>
            {status === "error" && errorMsg && (
              <motion.p id="hero-email-error" role="alert"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute -bottom-8 left-0 right-0 text-sm text-coral font-medium"
              >
                {errorMsg}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          variants={statContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="flex gap-14 md:gap-20 justify-center flex-wrap"
        >
          <motion.div variants={statItemVariants}>
            <div className="font-serif text-3xl md:text-4xl font-bold mb-1.5 text-sage">
              <CountUp end={47} suffix=" min" duration={2200} delay={0} />
            </div>
            <div className="text-xs text-ink/40 font-medium uppercase tracking-wider">
              Avg hold time you skip
            </div>
          </motion.div>
          <motion.div variants={statItemVariants}>
            <div className="font-serif text-3xl md:text-4xl font-bold mb-1.5 text-ink/80">
              <CountUp end={89} suffix="%" duration={2000} delay={250} />
            </div>
            <div className="text-xs text-ink/40 font-medium uppercase tracking-wider">
              Issues fully resolved
            </div>
          </motion.div>
          <motion.div variants={statItemVariants}>
            <div className="font-serif text-3xl md:text-4xl font-bold mb-1.5 text-amber-700">
              <CountUp end={4.9} suffix="★" decimals={1} duration={1800} delay={500} />
            </div>
            <div className="text-xs text-ink/40 font-medium uppercase tracking-wider">
              From people who chill now
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
