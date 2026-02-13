"use client";

import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { StaggerContainer, StaggerItem } from "@/components/ui/AnimateOnScroll";

const features = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    title: "Live tracking",
    desc: "Every step visible. Submitted, in progress, escalated, resolved. No more guessing.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 3v18h18" />
        <path d="M18 17V9M13 17V5M8 17v-3" />
      </svg>
    ),
    title: "Company intel",
    desc: "Average resolution times. Success rates. Best contact routes. We show you what to expect before you even start.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "No surprises",
    desc: "Before you submit, you see exactly how we'll handle it. Full resolution, guided, or advisory. Straight up.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    title: "Receipts",
    desc: "What was the outcome? How much did we recover? Everything documented. Your money back, with proof.",
  },
];

const mockIssues = [
  {
    emoji: "✈️",
    company: "British Airways",
    tier: "Full Resolution",
    tierClass: "bg-sage/20 text-[#7aad8e]",
    status: "IN PROGRESS",
    statusClass: "bg-sage/20 text-[#7aad8e]",
    desc: "EU261 compensation claim — flight BA287 cancelled 14 Jan",
    meta: "Avg resolution: 12 days  •  Day 4 of 12",
    progress: 35,
    fillClass: "fill-sage",
  },
  {
    emoji: "🏦",
    company: "Barclays",
    tier: "Guided",
    tierClass: "bg-[#FFF3E0]/15 text-[#FFB74D]",
    status: "ESCALATED",
    statusClass: "bg-[#1565C0]/15 text-[#64B5F6]",
    desc: "Disputed charge £247.00 — merchant not responding",
    meta: "Avg resolution: 8 days  •  Chargeback filed",
    progress: 60,
    fillClass: "fill-orange",
  },
  {
    emoji: "📦",
    company: "Amazon",
    tier: "Full Resolution",
    tierClass: "bg-sage/20 text-[#7aad8e]",
    status: "RESOLVED ✓",
    statusClass: "bg-[#2E7D32]/15 text-[#81C784]",
    desc: "Missing item from order — full refund secured",
    meta: "Resolved in 2 hours  •  £89.99 refunded",
    progress: 100,
    fillClass: "fill-green",
  },
];

export default function AppPreview() {
  return (
    <section
      id="app"
      className="relative bg-ink text-cream py-24 md:py-32 lg:py-40 overflow-hidden"
    >
      <div className="max-w-[1200px] mx-auto px-8 md:px-12">
        <AnimateOnScroll>
          <div className="text-xs font-semibold tracking-[0.15em] uppercase mb-5 text-warm">
            The App
          </div>
        </AnimateOnScroll>
        <AnimateOnScroll>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6 text-paper">
            You&apos;ll know more than the company does
          </h2>
        </AnimateOnScroll>
        <AnimateOnScroll>
          <p className="text-lg leading-relaxed max-w-[600px] text-paper/60">
            Real-time status. Resolution benchmarks. Full transparency. The
            support experience you always deserved.
          </p>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center mt-16">
          {/* Features list */}
          <StaggerContainer className="flex flex-col gap-3" stagger={0.1}>
            {features.map((f) => (
              <StaggerItem key={f.title} x={-30} y={0}>
                <div className="flex gap-5 p-5 rounded-2xl transition-all duration-300 hover:bg-white/[0.04] hover:translate-x-1.5 group">
                  <div className="w-12 h-12 rounded-xl bg-sage/20 flex items-center justify-center flex-shrink-0 transition-all duration-300 text-sage group-hover:shadow-[0_0_16px_rgba(74,107,90,0.25)]">
                    {f.icon}
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-paper mb-1.5">
                      {f.title}
                    </h4>
                    <p className="text-sm leading-relaxed text-paper/55">
                      {f.desc}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* Mockup */}
          <AnimateOnScroll x={80} y={0} duration={1}>
            <div className="bg-white/[0.04] rounded-3xl p-8 shadow-[0_24px_80px_rgba(0,0,0,0.3)] border border-white/[0.08] backdrop-blur-sm">
              <div className="flex justify-between items-center mb-7 pb-5 border-b border-white/[0.08]">
                <div className="font-bold text-lg text-paper">Your Issues</div>
                <div className="text-xs font-semibold px-4 py-1.5 rounded-full bg-[#FFF3E0]/15 text-[#FFB74D]">
                  2 Active
                </div>
              </div>

              {mockIssues.map((issue, i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] mb-4 last:mb-0 transition-all duration-300 hover:border-sage/20 hover:shadow-[0_4px_16px_rgba(0,0,0,0.2)]"
                >
                  <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
                    <div className="font-semibold text-sm text-paper flex items-center gap-2">
                      <span>{issue.emoji}</span>
                      <span>{issue.company}</span>
                      <span
                        className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${issue.tierClass}`}
                      >
                        {issue.tier}
                      </span>
                    </div>
                    <div
                      className={`text-[10px] font-semibold px-3 py-1 rounded-full uppercase tracking-wider ${issue.statusClass}`}
                    >
                      {issue.status}
                    </div>
                  </div>
                  <div className="text-sm text-paper/50 mb-2">{issue.desc}</div>
                  <div className="text-xs text-paper/35 mb-3">{issue.meta}</div>
                  <div className="progress-bar-track-dark">
                    <div
                      className={`progress-bar-fill ${issue.fillClass}`}
                      style={{ width: `${issue.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
