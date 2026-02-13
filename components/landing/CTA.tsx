"use client";

import { motion } from "framer-motion";
import ParticleCanvas from "@/components/ui/ParticleCanvas";
import WaitlistForm from "@/components/ui/WaitlistForm";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function CTA() {
  return (
    <section
      id="waitlist"
      className="relative bg-ink text-cream py-32 md:py-40 lg:py-48 overflow-hidden text-center"
    >
      {/* Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(circle, rgba(74, 107, 90, 0.2) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <ParticleCanvas />

      <motion.div
        className="max-w-[1200px] mx-auto px-8 md:px-12 relative z-[1]"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h2
          variants={itemVariants}
          className="font-serif text-4xl md:text-5xl lg:text-7xl font-extrabold leading-[1.1] mb-6 text-paper"
          style={{ textShadow: "0 0 60px rgba(74, 107, 90, 0.25)" }}
        >
          We handle it. You chill.
        </motion.h2>

        <motion.p
          variants={itemVariants}
          className="text-lg text-paper/60 max-w-[520px] mx-auto mb-4 leading-relaxed"
        >
          Waitlist open for founding members.
        </motion.p>

        <motion.p
          variants={itemVariants}
          className="text-base text-sage font-semibold max-w-[520px] mx-auto mb-12 leading-relaxed"
        >
          50% off. Locked in. Forever. Yes, really.
        </motion.p>

        <motion.div variants={itemVariants}>
          <WaitlistForm />
        </motion.div>
      </motion.div>
    </section>
  );
}
