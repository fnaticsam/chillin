"use client";

import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { StaggerContainer, StaggerItem } from "@/components/ui/AnimateOnScroll";

const moatCards = [
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-6 h-6"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "Legally authorised",
    desc: "You sign once. After that, companies are legally required to deal with us as if we're you. No loopholes, no runaround.",
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-6 h-6"
      >
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    title: "We've seen this before",
    desc: "Every case makes us smarter. We know which number to call, which department actually helps, and what to say to skip three weeks of back-and-forth.",
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-6 h-6"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Companies know us",
    desc: "As we grow, companies give us priority access. Faster queues, direct escalation paths, dedicated contacts. Your issue moves quicker because we've been here before.",
  },
];

export default function Moat() {
  return (
    <section id="moat" className="relative bg-cream text-ink py-24 md:py-32 lg:py-40">
      <div className="max-w-[1200px] mx-auto px-8 md:px-12">
        <div className="text-center max-w-[600px] mx-auto mb-16">
          <AnimateOnScroll>
            <div className="text-xs font-semibold tracking-[0.15em] uppercase mb-5 text-sage">
              Why It Works
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              This isn&apos;t a chatbot. It&apos;s a system.
            </h2>
          </AnimateOnScroll>
        </div>

        <StaggerContainer
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8"
          stagger={0.1}
        >
          {moatCards.map((card) => (
            <StaggerItem key={card.title}>
              <div className="p-8 lg:p-10 rounded-3xl bg-white/60 border border-black/[0.04] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(0,0,0,0.08)]">
                <div className="w-14 h-14 rounded-2xl bg-sage-light flex items-center justify-center mb-6 text-sage">
                  {card.icon}
                </div>
                <h4 className="font-serif text-xl font-bold mb-4">
                  {card.title}
                </h4>
                <p className="text-sm text-ink/60 leading-relaxed">
                  {card.desc}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
