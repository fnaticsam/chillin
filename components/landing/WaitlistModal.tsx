"use client";

import { useEffect, useRef } from "react";
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
    <dialog
      ref={dialogRef}
      aria-labelledby="waitlist-dialog-title"
      aria-describedby="waitlist-dialog-description"
      onCancel={onClose}
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const items = event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), a[href], [tabindex="0"]');
        const first = items[0], last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
      className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-[460px] max-h-[90dvh] overflow-y-auto rounded-3xl p-0 bg-white text-ink shadow-2xl backdrop:bg-ink/60 backdrop:backdrop-blur-sm"
    >
      <div className="relative p-8 md:p-10 border-l-[3px] border-l-sage">
        <button type="button" onClick={onClose} aria-label="Close waitlist dialog" className="absolute top-4 right-4 w-10 h-10 rounded-full hover:bg-cream focus-visible:outline-2 focus-visible:outline-sage">×</button>
        <h2 id="waitlist-dialog-title" className="font-serif text-2xl font-bold mb-2 pr-6">Alright, let&apos;s get you sorted</h2>
        <p id="waitlist-dialog-description" className="text-sm text-ink/70 mb-8">Join the founding crew. 50% off. Locked in forever. The hold music stops here.</p>
        {status === "success" ? (
          <p role="status" className="py-4 text-sage font-semibold">You&apos;re in! Redirecting...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" aria-busy={status === "loading"}>
            <label htmlFor="modal-email" className="block text-sm font-semibold">Email address</label>
            <input
              id="modal-email" name="email" type="email" autoComplete="email" required maxLength={254}
              value={email} onChange={(event) => { setEmail(event.target.value); if (status === "error") setStatus("idle"); }}
              aria-invalid={status === "error"} aria-describedby={status === "error" ? "modal-email-error" : undefined}
              className="w-full px-5 py-4 rounded-xl bg-cream/60 border border-ink/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage"
              disabled={status === "loading"}
            />
            {status === "error" && <p id="modal-email-error" role="alert" className="text-sm text-red-800">{errorMsg}</p>}
            <button type="submit" disabled={status === "loading"} className="w-full px-8 py-4 rounded-xl bg-ink text-paper font-semibold disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-sage">{status === "loading" ? "Joining..." : "I'm in"}</button>
          </form>
        )}
        <p className="text-xs text-ink/70 mt-6 text-center">No spam. Just updates on when we launch.</p>
      </div>
    </dialog>
  );
}
