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

/*
 * Karaoke timing with a dramatic pause before "cause" (index 8).
 *
 * Layout across scroll 0.15 → 0.75:
 *   0.15 – 0.40  →  words 0-7   ("There's not a problem that I can't fix,")
 *   0.40 – 0.50  →  PAUSE (nothing new lights up)
 *   0.50 – 0.72  →  words 8-15  ("cause I can do it in the mix")
 *
 * Each word gets a "center" point where it's brightest, and fades
 * in before / fades out after — like a spotlight sweeping across.
 */
function getWordCenter(index: number): number {
  const pauseWord = 8; // "cause"
  if (index < pauseWord) {
    // Words 0-7 spread across 0.15 → 0.40
    return 0.15 + (index / (pauseWord - 1)) * 0.25;
  } else {
    // Words 8-15 spread across 0.50 → 0.72
    const i = index - pauseWord;
    const count = words.length - pauseWord;
    return 0.50 + (i / (count - 1)) * 0.22;
  }
}

// How wide the "spotlight" is — word fades in over this range before center
// and fades back out over this range after center
const SPOTLIGHT_HALF = 0.06;

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
  // Top row
  { x: 3,  y: 5,  size: 34, opacity: 0.32, speed: 50,  floatAmp: 14, floatDur: 4.0 },
  { x: 18, y: 8,  size: 22, opacity: 0.20, speed: -28, floatAmp: 8,  floatDur: 5.4 },
  { x: 35, y: 3,  size: 26, opacity: 0.22, speed: 32,  floatAmp: 10, floatDur: 4.6 },
  { x: 55, y: 6,  size: 18, opacity: 0.18, speed: -22, floatAmp: 9,  floatDur: 5.8 },
  { x: 75, y: 4,  size: 24, opacity: 0.24, speed: 36,  floatAmp: 11, floatDur: 4.2 },
  { x: 90, y: 8,  size: 30, opacity: 0.28, speed: -42, floatAmp: 12, floatDur: 5.0 },
  // Upper-mid
  { x: 8,  y: 25, size: 20, opacity: 0.18, speed: 28,  floatAmp: 10, floatDur: 5.2 },
  { x: 28, y: 22, size: 16, opacity: 0.15, speed: -24, floatAmp: 7,  floatDur: 4.8 },
  { x: 50, y: 20, size: 14, opacity: 0.12, speed: 20,  floatAmp: 6,  floatDur: 5.6 },
  { x: 70, y: 24, size: 18, opacity: 0.16, speed: -30, floatAmp: 8,  floatDur: 4.4 },
  { x: 95, y: 22, size: 22, opacity: 0.20, speed: 34,  floatAmp: 10, floatDur: 5.0 },
  // Middle band (near text — smaller & more subtle)
  { x: 2,  y: 45, size: 18, opacity: 0.14, speed: 22,  floatAmp: 8,  floatDur: 4.6 },
  { x: 22, y: 48, size: 12, opacity: 0.10, speed: -18, floatAmp: 5,  floatDur: 5.4 },
  { x: 42, y: 42, size: 14, opacity: 0.10, speed: 16,  floatAmp: 6,  floatDur: 6.0 },
  { x: 62, y: 50, size: 12, opacity: 0.10, speed: -20, floatAmp: 5,  floatDur: 5.2 },
  { x: 82, y: 44, size: 16, opacity: 0.12, speed: 24,  floatAmp: 7,  floatDur: 4.8 },
  { x: 97, y: 48, size: 14, opacity: 0.12, speed: -18, floatAmp: 6,  floatDur: 5.6 },
  // Lower-mid
  { x: 10, y: 68, size: 20, opacity: 0.18, speed: -32, floatAmp: 10, floatDur: 4.4 },
  { x: 30, y: 72, size: 16, opacity: 0.16, speed: 26,  floatAmp: 8,  floatDur: 5.0 },
  { x: 48, y: 70, size: 18, opacity: 0.14, speed: -22, floatAmp: 7,  floatDur: 5.8 },
  { x: 68, y: 68, size: 22, opacity: 0.20, speed: 30,  floatAmp: 9,  floatDur: 4.2 },
  { x: 88, y: 72, size: 16, opacity: 0.16, speed: -28, floatAmp: 8,  floatDur: 5.4 },
  // Bottom row
  { x: 5,  y: 88, size: 28, opacity: 0.26, speed: 40,  floatAmp: 12, floatDur: 3.8 },
  { x: 20, y: 92, size: 20, opacity: 0.20, speed: -34, floatAmp: 10, floatDur: 4.6 },
  { x: 40, y: 88, size: 24, opacity: 0.22, speed: 36,  floatAmp: 11, floatDur: 5.2 },
  { x: 58, y: 90, size: 18, opacity: 0.18, speed: -26, floatAmp: 9,  floatDur: 4.0 },
  { x: 78, y: 88, size: 26, opacity: 0.24, speed: 38,  floatAmp: 12, floatDur: 3.6 },
  { x: 94, y: 92, size: 32, opacity: 0.30, speed: -44, floatAmp: 14, floatDur: 4.8 },
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

      <div className="relative max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="relative flex items-center justify-center min-h-[160px] md:min-h-[200px]">
          <div className="relative z-[1] text-center">
            <p className="font-serif text-2xl md:text-4xl lg:text-[2.75rem] font-semibold leading-tight mx-auto mb-4 italic whitespace-nowrap">
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
              <p className="text-sm text-paper/40 font-medium tracking-wide">
                Ini Kamoze
              </p>
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
  progress,
}: {
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const center = getWordCenter(index);
  const fadeIn = center - SPOTLIGHT_HALF;
  const fadeOut = center + SPOTLIGHT_HALF;

  // Color: grey → white at center → grey again (spotlight sweep)
  const color = useTransform(
    progress,
    [fadeIn, center, fadeOut],
    [
      "rgba(120, 120, 135, 0.4)",
      "rgba(255, 255, 255, 1)",
      "rgba(120, 120, 135, 0.4)",
    ]
  );

  // Bounce: pops up at center, settles back
  const rawY = useTransform(
    progress,
    [fadeIn, center - 0.01, center, center + 0.01, fadeOut],
    [0, -2, -10, -2, 0]
  );
  const y = useSpring(rawY, { stiffness: 500, damping: 18, mass: 0.4 });

  // Scale: pops noticeably bigger at center
  const rawScale = useTransform(
    progress,
    [fadeIn, center, fadeOut],
    [1.0, 1.22, 1.0]
  );
  const scale = useSpring(rawScale, { stiffness: 500, damping: 18, mass: 0.4 });

  return (
    <motion.span
      className="inline-block mr-[0.28em]"
      style={{
        color,
        y,
        scale,
      }}
    >
      {word}
    </motion.span>
  );
}
