"use client";

import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { StaggerContainer, StaggerItem } from "@/components/ui/AnimateOnScroll";

/* ── Custom line-art SVG icons ── */

function IconChatbotLoop() {
  return (
    <svg viewBox="0 0 48 48" width={40} height={40} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" aria-hidden="true">
      <rect x="8" y="10" width="24" height="18" rx="4" />
      <path d="M14 28 l-2 6 6-3" />
      <circle cx="15" cy="19" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="20" cy="19" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="25" cy="19" r="1.5" fill="currentColor" stroke="none" />
      <path d="M36 16 a8 8 0 1 1 -2 -6" />
      <path d="M34 10 l2 6 -6 -1" />
    </svg>
  );
}

function IconPhoneDisconnected() {
  return (
    <svg viewBox="0 0 48 48" width={40} height={40} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" aria-hidden="true">
      <path d="M13 8 c0 0 -5 2 -5 10 c0 8 8 16 16 20 c8 4 10 -1 10 -1 l-4 -6 c0 0 -2 1 -4 0 c-3 -1.5 -8 -6 -10 -10 c-1 -2 0 -4 0 -4 z" />
      <line x1="30" y1="8" x2="42" y2="20" />
      <path d="M34 6 l1 5 -3 1 2 4" />
      <path d="M40 12 l-1 4 3 1 -1 3" />
    </svg>
  );
}

function IconConfused() {
  return (
    <svg viewBox="0 0 48 48" width={40} height={40} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" aria-hidden="true">
      <circle cx="24" cy="24" r="16" />
      <path d="M14 16 Q 17 13 20 16" />
      <path d="M28 18 Q 31 15 34 18" />
      <circle cx="17" cy="20" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="31" cy="21" r="1.5" fill="currentColor" stroke="none" />
      <path d="M18 30 Q 21 28 24 30 Q 27 32 30 30" />
      <path d="M36 6 Q 40 6 40 10 Q 40 13 36 14" />
      <circle cx="36" cy="17" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconWhiteFlag() {
  return (
    <svg viewBox="0 0 48 48" width={40} height={40} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" aria-hidden="true">
      <line x1="14" y1="8" x2="14" y2="42" />
      <path d="M14 8 Q 22 6 28 12 Q 34 18 40 16 L40 28 Q 34 30 28 24 Q 22 18 14 20 Z" />
      <path d="M10 42 h8" />
      <circle cx="23" cy="14" r="2" />
      <line x1="21.5" y1="12.5" x2="24.5" y2="15.5" />
      <line x1="24.5" y1="12.5" x2="21.5" y2="15.5" />
    </svg>
  );
}

/* ── Faces for comparison ── */

function SadFace() {
  return (
    <svg viewBox="0 0 24 24" width={48} height={48} className="text-coral" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M 7 10.5 Q 8.5 13 10 10.5" />
      <path d="M 14 10.5 Q 15.5 13 17 10.5" />
      <path d="M 8 16.5 Q 12 13.5 16 16.5" />
    </svg>
  );
}

function HappyFace() {
  return (
    <svg viewBox="0 0 24 24" width={48} height={48} className="text-sage" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M 7 10.5 Q 8.5 8 10 10.5" />
      <path d="M 14 10.5 Q 15.5 8 17 10.5" />
      <path d="M 8 14.5 Q 12 17.5 16 14.5" />
    </svg>
  );
}

/* ── Pain card data with unique styling per card ── */

const painCards = [
  {
    icon: IconChatbotLoop,
    title: "Chatbots that loop forever",
    desc: "Stuck in an endless script that never reaches a human.",
    rotate: "-2deg",
    accent: "border-l-[3px] border-l-coral",
    bg: "bg-white",
    iconBg: "bg-coral/[0.08]",
  },
  {
    icon: IconPhoneDisconnected,
    title: "45 min hold, whoops disconnected.",
    desc: "All that waiting, gone in a click. Start over.",
    rotate: "1.5deg",
    accent: "border-b-[3px] border-b-coral/60",
    bg: "bg-coral/[0.03]",
    iconBg: "bg-white/80",
  },
  {
    icon: IconConfused,
    title: '"Not getting the issue?"',
    desc: "Transferred again. Nobody reads the notes.",
    rotate: "-1deg",
    accent: "ring-1 ring-coral/15",
    bg: "bg-white",
    iconBg: "bg-coral/[0.06]",
  },
  {
    icon: IconWhiteFlag,
    title: "You give up. They win.",
    desc: "You accept the bad deal because fighting costs more.",
    rotate: "2.5deg",
    accent: "border-t-[3px] border-t-coral/50",
    bg: "bg-ink/[0.03]",
    iconBg: "bg-coral/[0.08]",
  },
];

const comparisonRows = [
  { label: "Time on hold", you: "47 min", chillin: "0 min" },
  { label: "Transfers", you: "4.2 avg", chillin: "1 concierge" },
  { label: "Outcome", you: "67% give up", chillin: "89% resolved" },
  { label: "Money lost / yr", you: "£340", chillin: "£0" },
];

export default function Problem() {
  return (
    <section
      id="problem"
      className="relative bg-cream text-ink py-24 md:py-32 lg:py-40 overflow-hidden"
    >
      <div className="max-w-[1200px] mx-auto px-8 md:px-12">
        {/* ── 1. Section label ── */}
        <AnimateOnScroll>
          <div className="text-center mb-12 md:mb-16">
            <div className="text-xs font-semibold tracking-[0.15em] uppercase mb-4 text-coral">
              The Problem
            </div>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              Sound familiar?
            </h2>
          </div>
        </AnimateOnScroll>

        {/* ── 2. Pain cards — scattered, each unique ── */}
        <StaggerContainer
          className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6"
          stagger={0.1}
        >
          {painCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <StaggerItem key={card.title}>
                <div
                  className={`group relative h-full p-6 md:p-7 rounded-2xl ${card.bg} ${card.accent} shadow-[0_2px_16px_rgba(0,0,0,0.04)] text-center transition-all duration-500 hover:shadow-[0_16px_48px_rgba(212,101,74,0.12)] hover:!rotate-0 hover:!translate-y-[-4px]`}
                  style={{ rotate: card.rotate, translate: i % 2 === 0 ? "0 0" : "0 8px" }}
                >
                  {/* Number tag */}
                  <div className="absolute top-3 right-4 font-serif text-[2.5rem] font-extrabold text-coral/[0.06] leading-none select-none">
                    {i + 1}
                  </div>
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${card.iconBg} text-coral mb-4 transition-all duration-300 group-hover:scale-110`}>
                    <Icon />
                  </div>
                  <h4 className="font-serif text-base md:text-lg lg:text-xl font-bold leading-snug mb-2">
                    {card.title}
                  </h4>
                  <p className="text-sm text-ink/40 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        {/* ── 3. Headline (centered, between cards and comparison) ── */}
        <div className="text-center mt-20 md:mt-28 mb-16 md:mb-20">
          <AnimateOnScroll>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
              Who&rsquo;s got the patience?{" "}
              <span className="text-coral">We do.</span>
            </h2>
          </AnimateOnScroll>
          <AnimateOnScroll>
            <p className="text-lg text-ink/50 max-w-[520px] mx-auto leading-relaxed">
              Every chatbot, phone tree, and &ldquo;your call is important to
              us&rdquo; is designed to make you quit. Sound familiar?
            </p>
          </AnimateOnScroll>
        </div>

        {/* ── 4. Floating comparison boxes ── */}
        <AnimateOnScroll>
          <div className="flex flex-col md:flex-row items-center md:items-stretch justify-center gap-6 md:gap-10">
            {/* "You Today" box */}
            <div className="w-full md:w-[380px] bg-white rounded-3xl p-8 md:p-10 shadow-[0_8px_40px_rgba(0,0,0,0.08)] border border-black/[0.04] md:rotate-[-1.5deg] md:translate-y-1 transition-transform duration-500 hover:rotate-0 hover:translate-y-0 hover:shadow-[0_16px_56px_rgba(0,0,0,0.12)]">
              <div className="flex flex-col items-center mb-8">
                <SadFace />
                <span className="text-xs font-semibold tracking-[0.15em] uppercase text-coral/80 mt-3">
                  You today
                </span>
              </div>
              <div className="space-y-6">
                {comparisonRows.map((row) => (
                  <div key={row.label} className="text-center">
                    <div className="font-serif text-2xl md:text-3xl lg:text-4xl font-extrabold text-coral">
                      {row.you}
                    </div>
                    <div className="text-sm text-ink/50 mt-1">{row.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* VS badge */}
            <div className="relative z-10 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-ink text-cream flex items-center justify-center font-serif font-bold text-lg shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
                vs
              </div>
            </div>

            {/* "You Chillin" box */}
            <div className="w-full md:w-[380px] bg-white rounded-3xl p-8 md:p-10 shadow-[0_8px_40px_rgba(0,0,0,0.08)] border border-black/[0.04] md:rotate-[1.5deg] md:-translate-y-1 transition-transform duration-500 hover:rotate-0 hover:translate-y-0 hover:shadow-[0_16px_56px_rgba(0,0,0,0.12)]">
              <div className="flex flex-col items-center mb-8">
                <HappyFace />
                <span className="text-xs font-semibold tracking-[0.15em] uppercase text-sage mt-3">
                  You Chillin
                </span>
              </div>
              <div className="space-y-6">
                {comparisonRows.map((row) => (
                  <div key={row.label} className="text-center">
                    <div className="font-serif text-2xl md:text-3xl lg:text-4xl font-extrabold text-sage">
                      {row.chillin}
                    </div>
                    <div className="text-sm text-ink/50 mt-1">{row.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </div>

      {/* Hold music curved text */}
      <svg
        className="absolute bottom-8 left-0 w-full h-20 opacity-[0.08] pointer-events-none z-0"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <path
            id="holdCurve1"
            d="M-100,50 C200,20 400,70 700,35 C1000,0 1200,60 1540,30"
          />
          <path
            id="holdCurve2"
            d="M-100,30 C300,60 600,10 900,50 C1200,80 1350,20 1540,45"
          />
        </defs>
        <text className="font-serif text-[16px] fill-coral italic">
          <textPath href="#holdCurve1" startOffset="0%">
            your call is important to us • please hold • your call is important
            to us • please hold • your call is important to us
          </textPath>
        </text>
        <text className="font-serif text-[16px] fill-coral italic">
          <textPath href="#holdCurve2" startOffset="10%">
            I&apos;ll need to transfer you • please hold • I&apos;ll need to
            transfer you • please hold • I&apos;ll need to transfer you
          </textPath>
        </text>
      </svg>
    </section>
  );
}
