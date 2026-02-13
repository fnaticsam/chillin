"use client";

import { motion, type Variants } from "framer-motion";
import { type ReactNode } from "react";

interface AnimateOnScrollProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
  x?: number;
  once?: boolean;
  amount?: number;
  as?: "div" | "section" | "p" | "h1" | "h2" | "h3" | "h4" | "span" | "li";
}

const defaultVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export default function AnimateOnScroll({
  children,
  className,
  delay = 0,
  duration = 0.7,
  y = 40,
  x = 0,
  once = true,
  amount = 0.15,
  as = "div",
}: AnimateOnScrollProps) {
  const Component = motion.create(as);

  const variants: Variants = {
    hidden: { opacity: 0, y, x },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <Component
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
    >
      {children}
    </Component>
  );
}

/* Stagger container: wrap children that each have AnimateOnScroll */
interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  once?: boolean;
  amount?: number;
}

const containerVariants = (stagger: number, delay: number): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger,
      delayChildren: delay,
    },
  },
});

export function StaggerContainer({
  children,
  className,
  stagger = 0.1,
  delay = 0,
  once = true,
  amount = 0.15,
}: StaggerContainerProps) {
  return (
    <motion.div
      className={className}
      variants={containerVariants(stagger, delay)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
    >
      {children}
    </motion.div>
  );
}

/* Stagger child: use inside StaggerContainer */
interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  y?: number;
  x?: number;
  duration?: number;
}

export function StaggerItem({
  children,
  className,
  y = 40,
  x = 0,
  duration = 0.7,
}: StaggerItemProps) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y, x },
        visible: {
          opacity: 1,
          y: 0,
          x: 0,
          transition: { duration, ease: [0.16, 1, 0.3, 1] as const },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
