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

/* ── Floating smiley positions ── */
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
    // Start tracking well before section enters, finish after it leaves
    offset: ["start end", "end start"],
  });

  return (
    <section
      ref={sectionRef}
      id="pullquote"
      className="relative bg-ink text-cream py-20 md:py-28 lg:py-32 overflow-hidden"
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
          <div className="relative z-[1] text-center">
            <p className="font-serif text-2xl md:text-4xl lg:text-[2.75rem] font-semibold leading-tight whitespace-nowrap mx-auto mb-3 italic">
              {words.map((word, i) => (
                <KaraokeWord
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

function KaraokeWord({
  word,
  index,
  total,
  progress,
}: {
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  // Evenly distribute words across scroll range 0.2 → 0.7
  // (section is tracked from "start end" to "end start", so
  //  0.2 ≈ section entering viewport, 0.7 ≈ section about to leave)
  const rangeStart = 0.2;
  const rangeEnd = 0.65;
  const wordWidth = (rangeEnd - rangeStart) / total;
  const activate = rangeStart + index * wordWidth;
  const peak = activate + wordWidth * 0.5;
  const settle = activate + wordWidth;

  // Color: sharp karaoke sweep from dim to white
  const color = useTransform(
    progress,
    [activate, settle],
    ["rgba(100, 100, 110, 0.35)", "rgba(255, 255, 255, 1)"]
  );

  // Opacity stays visible throughout but ramps up
  const opacity = useTransform(
    progress,
    [activate, settle],
    [0.35, 1]
  );

  // Bounce: pop up, overshoot, settle
  const rawY = useTransform(
    progress,
    [activate, peak, settle],
    [12, -8, 0]
  );
  const y = useSpring(rawY, { stiffness: 400, damping: 15, mass: 0.5 });

  // Scale: pop bigger at activation, settle back
  const rawScale = useTransform(
    progress,
    [activate, peak, settle],
    [0.95, 1.12, 1.0]
  );
  const scale = useSpring(rawScale, { stiffness: 400, damping: 15, mass: 0.5 });

  return (
    <motion.span
      className="inline-block mr-[0.25em]"
      style={{
        color,
        opacity,
        y,
        scale,
      }}
    >
      {word}
    </motion.span>
  );
}
