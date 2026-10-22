"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

type Status = "idle" | "loading" | "success" | "error";
const validRef = /^(?:[A-HJ-NP-Z2-9]{8}|[a-f0-9]{32})$/;

export function useWaitlistSignup(onSuccess?: () => void) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const request = useRef<AbortController | null>(null);
  const redirect = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    request.current?.abort();
    if (redirect.current) clearTimeout(redirect.current);
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (request.current || status === "success") return;
    const controller = new AbortController();
    request.current = controller;
    setStatus("loading");
    setErrorMsg("");
    try {
      // Read at submission time so all signup surfaces retain the invite URL.
      const ref = new URLSearchParams(window.location.search).get("ref");
      const response = await fetch("/api/waitlist", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, ...(ref && validRef.test(ref) ? { ref } : {}) }),
        signal: controller.signal,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(typeof data.error === "string" ? data.error : "Something went wrong. Try again.");
      if (typeof data.refCode !== "string" || !validRef.test(data.refCode)) throw new Error("Could not load your spot. Please try again.");
      if (controller.signal.aborted) return;
      setStatus("success");
      redirect.current = setTimeout(() => {
        onSuccess?.();
        router.push(`/waitlist?ref=${encodeURIComponent(data.refCode)}`);
      }, 800);
    } catch (error) {
      if (!controller.signal.aborted) {
        setErrorMsg(error instanceof Error ? error.message : "Something went wrong. Try again.");
        setStatus("error");
      }
    } finally { request.current = null; }
  }
  return { email, setEmail, status, setStatus, errorMsg, setErrorMsg, handleSubmit };
}
