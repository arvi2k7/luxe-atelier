"use client";

import { useState } from "react";
import Link from "next/link";

const inputClass =
  "w-full border border-gold/30 bg-transparent px-3 py-2 text-sm text-bone placeholder:text-bone-muted/60 focus:border-gold focus:outline-none";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Something went wrong.");
      setSubmitting(false);
      return;
    }

    setSent(true);
    setSubmitting(false);
  }

  if (sent) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-6">
        <p className="text-xs uppercase tracking-[0.15em] text-gold">Check your inbox</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-bone">
          Reset link sent
        </h1>
        <p className="mt-4 text-sm text-bone-muted leading-relaxed">
          If an account exists for that email, you&apos;ll receive a password reset link shortly.
        </p>
        <Link href="/login" className="mt-6 text-xs text-gold-bright hover:underline">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-6">
      <p className="text-xs uppercase tracking-[0.15em] text-gold">Reset password</p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-bone">
        Forgot your password?
      </h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <input required type="email" placeholder="Email" className={inputClass}
          value={email} onChange={(e) => setEmail(e.target.value)} />

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button type="submit" disabled={submitting}
          className="mt-2 w-full border border-gold bg-gold/10 py-3 text-sm tracking-[0.1em] text-gold-bright hover:bg-gold/20 disabled:opacity-50 transition-colors">
          {submitting ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-bone-muted">
        <Link href="/login" className="text-gold-bright hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
