"use client";

import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { StaggerContainer, StaggerItem } from "@/components/ui/AnimateOnScroll";

const tiers = [
  {
    badge: "Full Resolution",
    badgeClass: "bg-sage/25 text-[#7aad8e]",
    title: "You do nothing",
    desc: "Submit it, forget it. We handle everything from first call to final resolution. You don't lift a finger.",
    items: [
      "Telecom billing & cancellations",
      "Energy complaints & switches",
      "Flight compensation (EU261)",
      "Insurance claims chasing",
      "Retail refunds & delivery issues",
      "Council tax & parking appeals",
      "Subscription cancellations",
    ],
    hoverBorder: "hover:border-sage",
  },
  {
    badge: "Guided Resolution",
    badgeClass: "bg-[#E67E22]/20 text-[#F0A060]",
    title: "2 minutes from you, tops",
    desc: "We do all the work. You tap one button when your bank needs a security code. That's it.",
    items: [
      "Banking complaints & disputes",
      "Mortgage & loan issues",
      "NHS & GP access complaints",
      "HMRC queries (Form 64-8)",
    ],
    hoverBorder: "hover:border-[#E67E22]",
  },
  {
    badge: "Advisory + Hold-for-Me",
    badgeClass: "bg-[#9B59B6]/20 text-[#C39BD3]",
    title: "We skip the queue for you",
    desc: "We sit on hold, get the right person on the line, then hand you the phone with a script. You walk in prepared.",
    items: [
      "Court & legal proceedings",
      "Benefits & DWP appeals",
      "Visa & immigration matters",
    ],
    hoverBorder: "hover:border-[#9B59B6]",
  },
];

export default function Coverage() {
  return (
    <section
      id="coverage"
      className="relative bg-ink text-cream py-24 md:py-32 lg:py-40 overflow-hidden"
    >
      <div className="max-w-[1200px] mx-auto px-8 md:px-12">
        <AnimateOnScroll>
          <div className="text-xs font-semibold tracking-[0.15em] uppercase mb-5 text-warm">
            What We Handle
          </div>
        </AnimateOnScroll>
        <AnimateOnScroll>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6 text-paper">
            If it makes you angry, we probably cover it
          </h2>
        </AnimateOnScroll>
        <AnimateOnScroll>
          <p className="text-lg leading-relaxed max-w-[600px] text-paper/60 mb-4">
            We&apos;re legally authorised to act on your behalf. Same framework
            solicitors use. Except we don&apos;t bill you £300 an hour and we
            actually answer the phone.
          </p>
        </AnimateOnScroll>

        <StaggerContainer
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mt-16"
          stagger={0.15}
        >
          {tiers.map((tier) => (
            <StaggerItem key={tier.badge} y={50}>
              <div
                className={`p-8 lg:p-10 rounded-3xl bg-paper/[0.04] border border-paper/[0.08] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.3)] ${tier.hoverBorder}`}
              >
                <div
                  className={`inline-block px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-6 relative overflow-hidden ${tier.badgeClass}`}
                >
                  {tier.badge}
                  <span className="absolute top-0 -left-full w-[200%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_3s_ease-in-out_infinite]" />
                </div>
                <h3 className="font-serif text-xl lg:text-2xl font-bold mb-3 text-paper">
                  {tier.title}
                </h3>
                <p className="text-sm text-paper/55 leading-relaxed mb-6">
                  {tier.desc}
                </p>
                <ul className="space-y-0">
                  {tier.items.map((item) => (
                    <li
                      key={item}
                      className="text-sm text-paper/70 py-2.5 border-t border-paper/[0.06] flex items-center gap-2.5"
                    >
                      <span className="flex-shrink-0 text-sage">✦</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
