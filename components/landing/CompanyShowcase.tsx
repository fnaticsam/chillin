"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import ChillinLogo from "@/components/ui/ChillinLogo";

/* ──────────────────────────────────────────────
   Company logo data
   ────────────────────────────────────────────── */
const companies = [
  { name: "Comcast", abbr: "X", bg: "#E20000", fg: "#fff", domain: "xfinity.com" },
  { name: "Ryanair", abbr: "FR", bg: "#073590", fg: "#F7C948", domain: "ryanair.com" },
  { name: "Spirit", abbr: "S", bg: "#FFE500", fg: "#000", domain: "spirit.com" },
  { name: "AT&T", abbr: "at&t", bg: "#009FDB", fg: "#fff", domain: "att.com" },
  { name: "United", abbr: "UA", bg: "#002244", fg: "#fff", domain: "united.com" },
  { name: "Wells Fargo", abbr: "WF", bg: "#D71E28", fg: "#FFC72C", domain: "wellsfargo.com" },
  { name: "Spectrum", abbr: "S", bg: "#003057", fg: "#00AEEF", domain: "spectrum.com" },
  { name: "British Gas", abbr: "BG", bg: "#0072CE", fg: "#fff", domain: "britishgas.co.uk" },
  { name: "TalkTalk", abbr: "TT", bg: "#6C2D82", fg: "#fff", domain: "talktalk.co.uk" },
  { name: "Three", abbr: "3", bg: "#000", fg: "#FF6600", domain: "three.co.uk" },
  { name: "Vodafone", abbr: "V", bg: "#E60000", fg: "#fff", domain: "vodafone.com" },
  { name: "EE", abbr: "EE", bg: "#007B85", fg: "#FFD700", domain: "ee.co.uk" },
];

/* ──────────────────────────────────────────────
   Chat bot status stepper steps
   ────────────────────────────────────────────── */
const steps = [
  { label: "Submitted", done: true },
  { label: "Reviewing", done: true },
  { label: "On the Call", done: false, active: true },
  { label: "Escalated", done: false },
  { label: "Resolved", done: false },
];

/* ──────────────────────────────────────────────
   Chat messages for the wireframe
   ────────────────────────────────────────────── */
const chatMessages = [
  {
    from: "bot",
    text: "Got it. Comcast billing dispute — overcharged by $47 on your last two statements.",
    time: "2 min ago",
  },
  {
    from: "bot",
    text: "I\u2019m on hold with their retention team now. Average wait: 23 min. I\u2019ll handle it.",
    time: "1 min ago",
  },
  {
    from: "bot",
    text: "Transferred to supervisor. Pushing for full credit plus a rate lock. Hang tight.",
    time: "Just now",
    highlight: true,
  },
];

/* ──────────────────────────────────────────────
   Single logo in the flowing stream
   ────────────────────────────────────────────── */
function StreamLogo({ company }: { company: (typeof companies)[0] }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg border border-white/[0.08] overflow-hidden"
      style={{ background: imgError ? company.bg : "#fff" }}
    >
      {!imgError ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={`https://logo.clearbit.com/${company.domain}?size=128`}
          alt={company.name}
          className="w-8 h-8 md:w-10 md:h-10 object-contain"
          loading="lazy"
          onError={() => setImgError(true)}
        />
      ) : (
        <span
          className="font-bold text-xs md:text-sm leading-none select-none"
          style={{ color: company.fg }}
        >
          {company.abbr}
        </span>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────
   Logo river — curved arcing streams that
   flow through the phone mockup
   ────────────────────────────────────────────── */
function LogoRiver() {
  const count = companies.length;
  const tripled = [...companies, ...companies, ...companies];
  const reversed = [...companies].reverse();
  const tripledReversed = [...reversed, ...reversed, ...reversed];

  /* Cosine wave for seamless looping (period = one company set) */
  const arcY = (index: number, amplitude: number, phase: number = 0) => {
    const t = ((index % count) / count + phase) % 1;
    return Math.cos(t * Math.PI * 2) * amplitude;
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Slight rotation for diagonal feel + scale to fill */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-8"
        style={{ transform: "rotate(-12deg) scale(1.3)" }}
      >
        {/* Arc stream 1 — flows left */}
        <div className="logo-stream-left">
          <div className="flex gap-5">
            {tripled.map((c, i) => (
              <div
                key={`a-${i}`}
                className="flex-shrink-0 transition-transform"
                style={{ transform: `translateY(${arcY(i, 40)}px)` }}
              >
                <StreamLogo company={c} />
              </div>
            ))}
          </div>
        </div>

        {/* Arc stream 2 — flows right, opposite phase */}
        <div className="logo-stream-right">
          <div className="flex gap-5">
            {tripledReversed.map((c, i) => (
              <div
                key={`b-${i}`}
                className="flex-shrink-0 transition-transform"
                style={{ transform: `translateY(${arcY(i, 40, 0.5)}px)` }}
              >
                <StreamLogo company={c} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edge gradients to fade logos smoothly into background */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/0 to-ink pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/0 to-ink pointer-events-none" />
    </div>
  );
}

/* ──────────────────────────────────────────────
   Status stepper inside the phone
   ────────────────────────────────────────────── */
function StatusStepper() {
  return (
    <div className="flex items-center gap-0 w-full px-1 mb-4">
      {steps.map((step, i) => (
        <div key={step.label} className="flex items-center flex-1 last:flex-initial">
          <div className="flex flex-col items-center">
            <div
              className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all ${
                step.done
                  ? "bg-sage"
                  : step.active
                    ? "bg-sage/80 animate-[status-pulse_2s_ease-in-out_infinite]"
                    : "bg-white/10 border border-white/20"
              }`}
            >
              {step.done && (
                <svg
                  width="8"
                  height="8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
            <span
              className={`text-[8px] mt-1.5 whitespace-nowrap font-medium ${
                step.done || step.active ? "text-sage" : "text-paper/30"
              }`}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`flex-1 h-px mx-1 mt-[-12px] ${
                step.done ? "bg-sage/60" : "bg-white/10"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────
   Chat message bubble
   ────────────────────────────────────────────── */
function ChatBubble({
  message,
  index,
}: {
  message: (typeof chatMessages)[0];
  index: number;
}) {
  return (
    <motion.div
      className="flex gap-2.5 mb-3 last:mb-0"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.4 + index * 0.15, duration: 0.5 }}
    >
      {/* Bot avatar */}
      <div className="w-7 h-7 rounded-full bg-sage/20 flex items-center justify-center flex-shrink-0 mt-0.5">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-sage"
        >
          <path d="M12 2a3 3 0 0 0-3 3v1a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
          <path d="M19 10H5a2 2 0 0 0-2 2v1a8 8 0 0 0 16 0v-1a2 2 0 0 0-2-2Z" />
        </svg>
      </div>

      {/* Message content */}
      <div className="flex-1">
        <div
          className={`rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-[13px] leading-relaxed ${
            message.highlight
              ? "bg-sage/15 text-sage border border-sage/20"
              : "bg-white/[0.06] text-paper/70 border border-white/[0.06]"
          }`}
        >
          {message.text}
        </div>
        <span className="text-[9px] text-paper/25 mt-1 block ml-1">
          {message.time}
        </span>
      </div>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────
   Phone Mockup
   ────────────────────────────────────────────── */
function PhoneMockup() {
  return (
    <div className="relative mx-auto max-w-[320px] md:max-w-[340px]">
      {/* Phone frame */}
      <div className="rounded-[2.5rem] border-2 border-white/[0.12] bg-ink/95 p-3 shadow-[0_24px_80px_rgba(0,0,0,0.6)] backdrop-blur-xl">
        {/* Notch */}
        <div className="flex justify-center mb-2">
          <div className="w-24 h-5 rounded-full bg-ink border border-white/[0.08]" />
        </div>

        {/* Inner screen */}
        <div className="rounded-[1.75rem] bg-ink/80 border border-white/[0.06] overflow-hidden">
          {/* Header */}
          <div className="px-5 pt-5 pb-3 border-b border-white/[0.06]">
            <div className="flex items-center justify-between mb-3">
              <ChillinLogo size="sm" variant="dark" />
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-sage animate-[pulse-dot_2s_ease-in-out_infinite]" />
                <span className="text-[10px] text-sage font-medium">Live</span>
              </div>
            </div>

            {/* Company being resolved */}
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "#E20000" }}
              >
                <span className="text-white text-[10px] font-bold">X</span>
              </div>
              <div>
                <div className="text-paper text-xs font-semibold">Comcast / Xfinity</div>
                <div className="text-paper/40 text-[10px]">Billing Dispute</div>
              </div>
            </div>

            {/* Status stepper */}
            <StatusStepper />
          </div>

          {/* Chat area */}
          <div className="px-4 py-4 min-h-[200px]">
            {chatMessages.map((msg, i) => (
              <ChatBubble key={i} message={msg} index={i} />
            ))}
          </div>

          {/* Input bar */}
          <div className="px-4 pb-5 pt-2 border-t border-white/[0.06]">
            <div className="flex items-center gap-2 bg-white/[0.04] rounded-full px-4 py-2.5 border border-white/[0.08]">
              <span className="text-paper/25 text-xs flex-1">Message...</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-paper/20"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Main section export
   ────────────────────────────────────────────── */
export default function CompanyShowcase() {
  return (
    <section className="relative bg-ink text-cream py-20 md:py-28 lg:py-36 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-8 md:px-12">
        {/* ── Section header ── */}
        <AnimateOnScroll>
          <div className="text-xs font-semibold tracking-[0.15em] uppercase mb-5 text-warm">
            Companies We Handle
          </div>
        </AnimateOnScroll>
        <AnimateOnScroll>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 text-paper max-w-[700px]">
            The companies you dread calling?{" "}
            <em className="italic bg-gradient-to-br from-sage to-[#7aad8e] bg-clip-text text-transparent">
              We call them daily
            </em>
          </h2>
        </AnimateOnScroll>
        <AnimateOnScroll>
          <p className="text-lg leading-relaxed max-w-[560px] text-paper/55 mb-6">
            From billing nightmares to cancelled flights, we take on the worst
            offenders so you never have to sit on hold again.
          </p>
        </AnimateOnScroll>
      </div>

      {/* ── Two-column: copy + phone with logo river ── */}
      <div className="max-w-[1200px] mx-auto px-8 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center mt-8 md:mt-12">
          {/* Left copy */}
          <div>
            <AnimateOnScroll>
              <h3 className="font-serif text-2xl md:text-3xl font-bold text-paper mb-6 leading-snug">
                Watch your issue move in real time
              </h3>
            </AnimateOnScroll>
            <AnimateOnScroll delay={0.1}>
              <p className="text-paper/55 leading-relaxed mb-8">
                Our chatbot keeps you in the loop with live updates while we fight on
                your behalf. See exactly where things stand &mdash; no guessing, no
                anxiety, no calling back yourself.
              </p>
            </AnimateOnScroll>

            {/* Feature pills */}
            <AnimateOnScroll delay={0.2}>
              <div className="flex flex-wrap gap-3">
                {[
                  "Live status tracker",
                  "Chat updates",
                  "Avg. resolution time",
                  "Escalation alerts",
                ].map((label) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] text-sm text-paper/60 font-medium"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-sage" />
                    {label}
                  </span>
                ))}
              </div>
            </AnimateOnScroll>
          </div>

          {/* Right: phone with logo river flowing through it */}
          <AnimateOnScroll x={60} y={0} duration={1}>
            <div className="relative min-h-[520px] md:min-h-[600px] flex items-center justify-center">
              <LogoRiver />
              <div className="relative z-10">
                <PhoneMockup />
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
