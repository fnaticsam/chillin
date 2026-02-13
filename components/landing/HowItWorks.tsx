"use client";

import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { StaggerContainer, StaggerItem } from "@/components/ui/AnimateOnScroll";

const steps = [
  {
    num: "01",
    title: "Vent",
    desc: "Open the app. Speak or type. Rant if you need to. A real human concierge picks it up and comes back with a plan.",
  },
  {
    num: "02",
    title: "We take the call",
    desc: "Your concierge calls the company, navigates the phone tree, sits through the hold music, and does the bit that makes normal people cry.",
  },
  {
    num: "03",
    title: "Watch it move",
    desc: "Live updates in the app. You'll know more about your case than the company does. Zero chasing required.",
  },
  {
    num: "04",
    title: "Done",
    desc: "Resolved, refunded, or escalated to the ombudsman. We know every route. We don't stop until it's sorted.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="relative bg-paper text-ink py-24 md:py-32 lg:py-40">
      <div className="max-w-[1200px] mx-auto px-8 md:px-12">
        <div className="text-center max-w-[600px] mx-auto mb-16">
          <AnimateOnScroll>
            <div className="text-xs font-semibold tracking-[0.15em] uppercase mb-5 text-sage">
              How It Works
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              One message from you. We handle the rest.
            </h2>
          </AnimateOnScroll>
        </div>

        <StaggerContainer
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative"
          stagger={0.1}
        >
          {/* Connecting line */}
          <div
            className="absolute top-[50px] left-[12%] right-[12%] h-[2px] z-0 opacity-40 hidden lg:block"
            style={{
              background:
                "linear-gradient(90deg, var(--color-sage-light), var(--color-sage), var(--color-sage-light))",
            }}
            aria-hidden="true"
          />

          {steps.map((step) => (
            <StaggerItem key={step.num} y={50}>
              <div className="relative z-[1] text-center p-8 rounded-3xl bg-white/60 border border-black/[0.04] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_12px_36px_rgba(0,0,0,0.08)]">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-sage text-paper font-serif text-xl font-bold mx-auto mb-6">
                  {step.num}
                </div>
                <h4 className="font-serif text-xl font-bold mb-3">
                  {step.title}
                </h4>
                <p className="text-sm text-ink/60 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
