"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

type FormState = "idle" | "loading" | "success" | "error";

export default function WaitlistForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setErrorMsg("Please enter a valid email.");
      setState("error");
      return;
    }

    setState("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Something went wrong. Try again.");
        setState("error");
        return;
      }

      setState("success");
      setTimeout(() => {
        router.push(`/waitlist?ref=${data.refCode}`);
      }, 800);
    } catch {
      setErrorMsg("Something went wrong. Try again.");
      setState("error");
    }
  };

  if (state === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sage/20 mb-6">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-sage)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="font-serif text-2xl md:text-3xl font-bold text-paper mb-3">
          You&apos;re in! Redirecting...
        </h3>
        <p className="text-paper/60 text-base max-w-[400px] mx-auto leading-relaxed">
          Welcome to the founding crew. 50% off, locked in forever.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-[480px] mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (state === "error") {
                  setState("idle");
                  setErrorMsg("");
                }
              }}
              placeholder="your@email.com"
              className="w-full px-6 py-4 rounded-full bg-white/10 border border-white/15 text-paper placeholder:text-paper/35 text-base outline-none transition-all duration-300 focus:border-sage/50 focus:bg-white/[0.12] focus:shadow-[0_0_0_3px_rgba(74,107,90,0.15)]"
              disabled={state === "loading"}
              autoComplete="email"
            />
          </div>
          <button
            type="submit"
            disabled={state === "loading"}
            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-cream text-ink text-base font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_36px_rgba(243,240,232,0.2)] disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none relative overflow-hidden group whitespace-nowrap"
          >
            {state === "loading" ? (
              <span className="inline-flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Joining...
              </span>
            ) : (
              <>
                Join the waitlist
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </>
            )}
            <span className="absolute top-0 -left-full w-[200%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-[left] duration-500 group-hover:left-full" />
          </button>
        </div>
      </form>

      <AnimatePresence>
        {state === "error" && errorMsg && (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="text-sm text-coral mt-3 text-center"
          >
            {errorMsg}
          </motion.p>
        )}
      </AnimatePresence>

      <p className="text-xs text-paper/35 mt-4 text-center">
        No spam. Just early access and your founding member discount.
      </p>
    </div>
  );
}
