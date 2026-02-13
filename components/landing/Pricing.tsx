"use client";

import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { StaggerContainer, StaggerItem } from "@/components/ui/AnimateOnScroll";
import { useWaitlistModal } from "./WaitlistProvider";

const plans = [
  {
    name: "Member",
    price: "49",
    tagline: "A few issues a month. We sort them all.",
    features: [
      "Up to 3 issues per month",
      "Full app access & tracking",
      "Company benchmarks & guides",
      "Letter of Authority included",
    ],
    featured: false,
  },
  {
    name: "Premium",
    price: "99",
    tagline: "Unlimited issues. Zero hold music. Ever.",
    features: [
      "Unlimited issues",
      "Priority concierge queue",
      "Hold-for-Me on all Tier 2 cases",
      "Proactive issue monitoring",
    ],
    featured: true,
  },
  {
    name: "Household",
    price: "149",
    tagline: "The whole family, sorted. One dedicated concierge.",
    features: [
      "Up to 4 household members",
      "Unlimited issues per member",
      "Dedicated concierge",
      "Everything in Premium",
    ],
    featured: false,
  },
];

export default function Pricing() {
  const { openWaitlistModal } = useWaitlistModal();

  return (
    <section
      id="pricing"
      className="relative bg-cream text-ink py-24 md:py-32 lg:py-40 overflow-hidden"
    >
      {/* Mesh gradient background */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: `
            radial-gradient(ellipse at 20% 30%, rgba(74, 107, 90, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, rgba(196, 168, 130, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(74, 107, 90, 0.04) 0%, transparent 60%)
          `,
        }}
        aria-hidden="true"
      />

      <div className="max-w-[1200px] mx-auto px-8 md:px-12 relative z-[1]">
        <div className="text-center max-w-[600px] mx-auto mb-16">
          <AnimateOnScroll>
            <div className="text-xs font-semibold tracking-[0.15em] uppercase mb-5 text-sage">
              Pricing
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
              What&apos;s your time actually worth?
            </h2>
          </AnimateOnScroll>
          <AnimateOnScroll>
            <p className="text-lg leading-relaxed text-ink/60">
              One hour on hold with your bank costs more than a month of Chillin.
              Just saying.
            </p>
          </AnimateOnScroll>
        </div>

        <StaggerContainer
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8"
          stagger={0.12}
        >
          {plans.map((plan) => (
            <StaggerItem key={plan.name} y={50}>
              <div
                className={`p-8 lg:p-10 rounded-3xl text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.08)] relative
                  ${
                    plan.featured
                      ? "bg-white/60 backdrop-blur-xl border-2 border-transparent"
                      : "bg-white/50 backdrop-blur-xl border border-black/[0.06]"
                  }
                `}
              >
                {/* Featured gradient border */}
                {plan.featured && (
                  <div
                    className="absolute inset-[-2px] rounded-[26px] p-[2px] z-[-1] animate-[border-glow_4s_ease-in-out_infinite]"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--color-sage), var(--color-sage-light), var(--color-sage), var(--color-sage-dark))",
                      backgroundSize: "300% 300%",
                      WebkitMask:
                        "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                      WebkitMaskComposite: "xor",
                      maskComposite: "exclude",
                    }}
                  />
                )}

                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full bg-sage text-paper text-xs font-bold uppercase tracking-wider">
                    Most Popular
                  </div>
                )}

                <h3 className="font-serif text-2xl font-bold mb-3 mt-2">
                  {plan.name}
                </h3>
                <div className="font-serif text-5xl md:text-6xl font-extrabold mb-2 text-ink">
                  <span className="text-2xl align-top leading-[1.6]">£</span>
                  {plan.price}
                  <span className="text-base font-normal text-ink/45 ml-1">
                    /month
                  </span>
                </div>
                <p className="text-sm text-ink/55 mb-8">{plan.tagline}</p>
                <ul className="text-left mb-8 space-y-0">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="text-sm py-3 border-t border-black/5 flex items-center gap-3 text-ink/70"
                    >
                      <span className="w-5 h-5 rounded-full bg-sage-light flex-shrink-0 flex items-center justify-center">
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="var(--color-sage)"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={openWaitlistModal}
                  className={`inline-block w-full py-4 px-9 rounded-full font-semibold text-base transition-all duration-300 hover:-translate-y-0.5 ${
                    plan.featured
                      ? "bg-sage text-paper hover:bg-sage-dark hover:shadow-[0_8px_24px_rgba(74,107,90,0.35)]"
                      : "bg-ink text-paper hover:shadow-[0_8px_24px_rgba(13,13,26,0.2)]"
                  }`}
                >
                  Join the waitlist
                </button>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <AnimateOnScroll>
          <div className="mt-14 flex justify-center">
            <div
              className="relative inline-flex items-center gap-4 md:gap-6 px-8 md:px-12 py-4 rounded-full bg-white border border-black/[0.06] text-ink shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.1)] group"
              style={{ animation: "gentle-float 6s ease-in-out infinite" }}
            >
              {/* Founding member label */}
              <span className="text-[10px] md:text-xs font-bold tracking-[0.18em] uppercase text-sage">
                Founding Member
              </span>

              {/* Dot separator */}
              <span className="w-1 h-1 rounded-full bg-ink/15 hidden sm:block" />

              {/* The deal */}
              <span className="font-serif text-xl md:text-2xl font-extrabold leading-none text-ink">
                50% <span className="text-sage">OFF</span>
              </span>

              {/* Dot separator */}
              <span className="w-1 h-1 rounded-full bg-ink/15 hidden sm:block" />

              {/* Tagline */}
              <span className="text-[11px] md:text-xs text-ink/45 font-medium tracking-wide hidden sm:block">
                Locked in forever
              </span>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
