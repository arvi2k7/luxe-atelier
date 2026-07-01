"use client";

import { useEffect, useState } from "react";

interface ExitIntentPromptProps {
  discountCode?: string;
  discountAmount?: string;
}

export function ExitIntentPrompt({ discountCode = "WELCOME10", discountAmount = "10%" }: ExitIntentPromptProps) {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    function handleMouseLeave(e: MouseEvent) {
      if (e.clientY <= 0 && !document.cookie.includes("exit_prompt_shown")) {
        setShow(true);
        document.cookie = "exit_prompt_shown=1; path=/; max-age=86400";
      }
    }

    function handleTouchStart() {
      if (!document.cookie.includes("exit_prompt_shown")) {
        setShow(true);
        document.cookie = "exit_prompt_shown=1; path=/; max-age=86400";
      }
    }

    const timer = setTimeout(() => {
      document.addEventListener("mouseleave", handleMouseLeave);
      document.addEventListener("touchstart", handleTouchStart, { once: true });
    }, 5000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await fetch("/api/cart/capture-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        credentials: "include",
      });
      setSubmitted(true);
    } catch {
      //
    } finally {
      setLoading(false);
    }
  }

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-modal flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative mx-4 w-full max-w-md border border-gold/30 bg-panel p-8">
        <button
          onClick={() => setShow(false)}
          className="absolute right-4 top-4 text-bone-muted hover:text-bone text-lg"
          aria-label="Close"
        >
          ✕
        </button>

        {!submitted ? (
          <>
            <p className="text-xs uppercase tracking-[0.15em] text-gold">Wait — before you go</p>
            <h3 className="mt-3 font-display text-2xl text-bone">
              Take {discountAmount} off your first order
            </h3>
            <p className="mt-2 text-sm text-bone-muted leading-relaxed">
              Drop your email below and we&apos;ll send you code <span className="text-gold-bright font-mono">{discountCode}</span>.
              No spam, just the occasional note.
            </p>
            <form onSubmit={handleSubmit} className="mt-6 flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 border border-gold/30 bg-vitrine px-4 py-3 text-sm text-bone placeholder:text-bone-muted/50 outline-none focus:border-gold"
              />
              <button
                type="submit"
                disabled={loading}
                className="border border-gold bg-gold/10 px-6 py-3 text-xs uppercase tracking-[0.12em] text-gold-bright transition-colors hover:bg-gold/20 disabled:opacity-50"
              >
                {loading ? "..." : "Get Code"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h3 className="font-display text-2xl text-bone">Check your inbox</h3>
            <p className="mt-2 text-sm text-bone-muted leading-relaxed">
              We&apos;ve sent <span className="text-gold-bright font-mono">{discountCode}</span> to <span className="text-bone">{email}</span>.
              Use it at checkout for {discountAmount} off.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
