"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useWaitlistSignup } from "@/components/ui/useWaitlistSignup";

interface WaitlistModalProps { isOpen: boolean; onClose: () => void }

export default function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { email, setEmail, status, setStatus, errorMsg, handleSubmit } = useWaitlistSignup(onClose);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!isOpen || !dialog) return;
    const previousOverflow = document.body.style.overflow;
    const trigger = document.activeElement;
    dialog.showModal(); // Native focus containment and inert background.
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (trigger instanceof HTMLElement && trigger.isConnected) trigger.focus();
    };
  }, [isOpen]);

  return (
    <motion.dialog
      ref={dialogRef}
      aria-labelledby="waitlist-dialog-title"
      aria-describedby="waitlist-dialog-description"
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      initial={{ opacity: 0, scale: 0.9, rotate: -2, y: 40 }}
      animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const items = event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), a[href], [tabindex="0"]');
        const first = items[0], last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
      className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-[460px] max-h-[90dvh] overflow-y-auto rounded-3xl p-0 bg-white text-ink shadow-[0_24px_80px_rgba(0,0,0,0.2)] border-l-[3px] border-l-sage backdrop:bg-ink/60 backdrop:backdrop-blur-sm"
    >
      <div className="relative p-8 md:p-10">
        <button type="button" onClick={onClose} aria-label="Close waitlist dialog" className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/[0.04] flex items-center justify-center text-ink/40 hover:text-ink hover:bg-black/[0.08] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-sage">
          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <div aria-hidden="true" className="absolute top-4 right-12 font-serif text-[4rem] font-extrabold text-sage/[0.05] leading-none select-none pointer-events-none">☺</div>
        <h2 id="waitlist-dialog-title" className="font-serif text-2xl font-bold mb-2 pr-6">Alright, let&apos;s get you sorted</h2>
        <p id="waitlist-dialog-description" className="text-sm text-ink/70 mb-8">Join the founding crew. 50% off. Locked in forever. The hold music stops here.</p>
        {status === "success" ? (
          <p role="status" className="flex items-center gap-3 py-4 text-sage font-semibold text-lg">
            <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            You&apos;re in! Redirecting...
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" aria-busy={status === "loading"}>
            <label htmlFor="modal-email" className="sr-only">Email address</label>
            <input
              id="modal-email" name="email" type="email" autoComplete="email" placeholder="your@email.com" required maxLength={254}
              value={email} onChange={(event) => { setEmail(event.target.value); if (status === "error") setStatus("idle"); }}
              aria-invalid={status === "error"} aria-describedby={status === "error" ? "modal-email-error" : undefined}
              className="w-full px-5 py-4 rounded-xl bg-cream/60 border border-ink/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage"
              disabled={status === "loading"}
            />
            {status === "error" && <p id="modal-email-error" role="alert" className="text-sm text-coral-dark">{errorMsg}</p>}
            <button type="submit" disabled={status === "loading"} className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-ink text-paper font-semibold transition-all duration-300 hover:bg-ink/90 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(13,13,26,0.2)] disabled:opacity-60 disabled:hover:translate-y-0 focus-visible:outline-2 focus-visible:outline-sage">
              {status === "loading" ? <><span aria-hidden="true" className="w-4 h-4 border-2 border-paper/30 border-t-paper rounded-full animate-spin" />Joining...</> : <>
                I&apos;m in
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </>}
            </button>
          </form>
        )}
        <p className="text-xs text-ink/70 mt-6 text-center">No spam. Just updates on when we launch.</p>
      </div>
    </motion.dialog>
  );
}
