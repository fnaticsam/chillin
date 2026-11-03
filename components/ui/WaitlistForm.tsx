"use client";


import { motion, AnimatePresence } from "framer-motion";
import { useWaitlistSignup } from "./useWaitlistSignup";



export default function WaitlistForm() {
  const { email, setEmail, status: state, setStatus: setState, errorMsg, setErrorMsg, handleSubmit } = useWaitlistSignup();

  if (state === "success") {
    return (
      <motion.div
        role="status"
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
        <div
          className="flex flex-col sm:flex-row items-stretch bg-white rounded-2xl p-2 shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-white/20 transition-all duration-500 hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)]"
        >
          <label htmlFor="waitlist-email" className="sr-only">Email address</label>
          <input
            id="waitlist-email"
            name="email"
            maxLength={254}
            required
            aria-invalid={state === "error"}
            aria-describedby={state === "error" ? "waitlist-email-error" : undefined}
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
            className="w-full min-w-0 sm:flex-1 px-5 py-3.5 rounded-xl bg-transparent text-ink placeholder:text-ink/30 text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-sage"
            disabled={state === "loading"}
            autoComplete="email"
          />
          <button
            type="submit"
            disabled={state === "loading"}
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-ink text-paper text-base font-semibold transition-all duration-300 hover:bg-ink/90 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(13,13,26,0.2)] disabled:opacity-60 disabled:hover:translate-y-0 whitespace-nowrap"
          >
            {state === "loading" ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-paper/30 border-t-paper rounded-full animate-spin" />
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
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>

      <AnimatePresence>
        {state === "error" && errorMsg && (
          <motion.p id="waitlist-email-error" role="alert"
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
