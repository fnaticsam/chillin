"use client";

import { useState, FormEvent, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setEmail("");
      setStatus("idle");
      setErrorMsg("");
    }
  }, [isOpen]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Something went wrong.");
        setStatus("error");
        return;
      }

      setStatus("success");
      setTimeout(() => {
        onClose();
        router.push(`/waitlist?ref=${data.refCode}`);
      }, 800);
    } catch {
      setErrorMsg("Something went wrong. Try again.");
      setStatus("error");
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal card — quirky tilted style like pain cards */}
          <motion.div
            className="relative z-10 w-full max-w-[460px] bg-white rounded-3xl p-8 md:p-10 shadow-[0_24px_80px_rgba(0,0,0,0.2)] border-l-[3px] border-l-sage"
            initial={{ opacity: 0, scale: 0.9, rotate: -2, y: 40 }}
            animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-black/[0.04] flex items-center justify-center text-ink/40 hover:text-ink hover:bg-black/[0.08] transition-all duration-200"
              aria-label="Close"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Background number like pain cards */}
            <div className="absolute top-4 right-12 font-serif text-[4rem] font-extrabold text-sage/[0.05] leading-none select-none pointer-events-none">
              ☺
            </div>

            <div className="mb-8">
              <h3 className="font-serif text-2xl md:text-3xl font-bold text-ink mb-2">
                Alright, let&apos;s get you sorted
              </h3>
              <p className="text-sm text-ink/50 leading-relaxed">
                Join the founding crew. 50% off. Locked in forever. The hold music stops here.
              </p>
            </div>

            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-3 py-4 text-sage font-semibold text-lg"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  You&apos;re in! Redirecting...
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <div>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (status === "error") setStatus("idle");
                      }}
                      className="w-full px-5 py-4 rounded-xl bg-cream/60 text-ink placeholder:text-ink/30 text-base border border-black/[0.06] focus:outline-none focus:border-sage/40 focus:shadow-[0_0_0_3px_rgba(74,107,90,0.1)] transition-all duration-200"
                      required
                      autoFocus
                      disabled={status === "loading"}
                    />
                    <AnimatePresence>
                      {status === "error" && errorMsg && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-sm text-coral font-medium mt-2"
                        >
                          {errorMsg}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-ink text-paper text-base font-semibold transition-all duration-300 hover:bg-ink/90 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(13,13,26,0.2)] disabled:opacity-60 disabled:hover:translate-y-0"
                  >
                    {status === "loading" ? (
                      <>
                        <span className="w-4 h-4 border-2 border-paper/30 border-t-paper rounded-full animate-spin" />
                        Hold on...
                      </>
                    ) : (
                      <>
                        I&apos;m in
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            <p className="text-xs text-ink/30 mt-6 text-center">
              No spam. Just updates on when we launch.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
