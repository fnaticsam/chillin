"use client";

import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import { useRef } from "react";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";

const quote =
  "There's not a problem that I can't fix, cause I can do it in the mix";
const words = quote.split(" ");

// Custom timing: fast reveal with a dramatic pause before "cause"
function getWordTiming(index: number) {
  const pauseWord = 8;
  if (index < pauseWord) {
    const start = (index / pauseWord) * 0.3;
    const end = ((index + 1) / pauseWord) * 0.3;
    return { start, mid: (start + end) / 2, end };
  } else {
    const i = index - pauseWord;
    const count = words.length - pauseWord;
    const start = 0.5 + (i / count) * 0.3;
    const end = 0.5 + ((i + 1) / count) * 0.3;
    return { start, mid: (start + end) / 2, end };
  }
}

/* ── Smiley face SVG ── */
function Smiley({ size }: { size: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M 7 10.5 Q 8.5 8 10 10.5" />
      <path d="M 14 10.5 Q 15.5 8 17 10.5" />
      <path d="M 8 14.5 Q 12 17.5 16 14.5" />
    </svg>
  );
}

/* ── Floating smiley positions — higher opacity, visible color ── */
const floatingSmileys = [
  { x: 5, y: 15, size: 36, opacity: 0.35, speed: 50, floatAmp: 14, floatDur: 4.0 },
  { x: 88, y: 10, size: 28, opacity: 0.25, speed: -40, floatAmp: 10, floatDur: 5.2 },
  { x: 15, y: 70, size: 24, opacity: 0.30, speed: 35, floatAmp: 12, floatDur: 3.6 },
  { x: 92, y: 65, size: 32, opacity: 0.30, speed: -45, floatAmp: 16, floatDur: 4.8 },
  { x: 45, y: 5, size: 22, opacity: 0.20, speed: 30, floatAmp: 8, floatDur: 5.0 },
  { x: 72, y: 80, size: 26, opacity: 0.25, speed: -35, floatAmp: 11, floatDur: 4.4 },
  { x: 30, y: 85, size: 20, opacity: 0.20, speed: 40, floatAmp: 10, floatDur: 3.8 },
  { x: 60, y: 8, size: 18, opacity: 0.18, speed: -25, floatAmp: 9, floatDur: 5.6 },
  { x: 2, y: 45, size: 22, opacity: 0.22, speed: 45, floatAmp: 13, floatDur: 4.2 },
  { x: 96, y: 40, size: 20, opacity: 0.20, speed: -38, floatAmp: 10, floatDur: 3.4 },
];

function FloatingSmiley({
  smiley,
  scrollProgress,
}: {
  smiley: (typeof floatingSmileys)[0];
  scrollProgress: MotionValue<number>;
}) {
  // Parallax Y driven by scroll
  const parallaxY = useTransform(
    scrollProgress,
    [0, 1],
    [smiley.speed, -smiley.speed]
  );

  return (
    <motion.div
      className="absolute pointer-events-none text-cream/80"
      style={{
        left: `${smiley.x}%`,
        top: `${smiley.y}%`,
        opacity: smiley.opacity,
        y: parallaxY,
      }}
      // Continuous float animation via Framer Motion (no CSS conflict)
      animate={{
        translateY: [0, -smiley.floatAmp, 0],
        rotate: [0, smiley.speed > 0 ? 6 : -6, 0],
      }}
      transition={{
        translateY: {
          duration: smiley.floatDur,
          repeat: Infinity,
          ease: "easeInOut",
        },
        rotate: {
          duration: smiley.floatDur * 1.3,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
    >
      <Smiley size={smiley.size} />
    </motion.div>
  );
}

export default function PullQuote() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.85", "end 0.15"],
  });

  return (
    <section
      ref={sectionRef}
      id="pullquote"
      className="relative bg-ink text-cream py-16 md:py-20 lg:py-24 overflow-hidden"
    >
      {/* Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(circle, rgba(74, 107, 90, 0.18), transparent 70%)",
          animation: "glow-pulse 4s ease-in-out infinite",
        }}
      />

      {/* Floating smileys */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {floatingSmileys.map((smiley, i) => (
          <FloatingSmiley
            key={i}
            smiley={smiley}
            scrollProgress={scrollYProgress}
          />
        ))}
      </div>

      <div className="relative max-w-[1200px] mx-auto px-8 md:px-12">
        <div className="relative flex items-center justify-center min-h-[160px] md:min-h-[200px]">
          {/* Quote text */}
          <div className="relative z-[1] text-center">
            <p className="font-serif text-2xl md:text-4xl lg:text-[2.75rem] font-semibold leading-tight whitespace-nowrap mx-auto mb-3 italic">
              {words.map((word, i) => (
                <WordReveal
                  key={i}
                  word={word}
                  index={i}
                  total={words.length}
                  progress={scrollYProgress}
                />
              ))}
            </p>
            <AnimateOnScroll>
              <p className="text-sm text-paper/40 font-medium">Ini Kamoze</p>
            </AnimateOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}

function WordReveal({
  word,
  index,
  progress,
}: {
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const { start, mid, end } = getWordTiming(index);

  // Opacity: start dim, end fully bright white
  const opacity = useTransform(progress, [start, end], [0.15, 1]);

  // Bounce: word drops in from above, overshoots down, settles
  const rawY = useTransform(
    progress,
    [start, mid, end],
    [18, -4, 0]
  );
  const y = useSpring(rawY, { stiffness: 300, damping: 20 });

  // Scale: starts small, pops slightly bigger, settles
  const rawScale = useTransform(
    progress,
    [start, mid, end],
    [0.92, 1.08, 1]
  );
  const scale = useSpring(rawScale, { stiffness: 300, damping: 18 });

  // Color: transition from muted sage to bright white
  const color = useTransform(
    progress,
    [start, (start + end) / 2, end],
    ["rgba(74, 107, 90, 0.6)", "rgba(250, 250, 247, 0.85)", "rgba(255, 255, 255, 1)"]
  );

  return (
    <motion.span
      className="inline-block mr-[0.25em]"
      style={{
        opacity,
        y,
        scale,
        color,
      }}
    >
      {word}
    </motion.span>
  );
}
