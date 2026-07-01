"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const inputClass =
  "w-full border border-gold/30 bg-transparent px-3 py-2 text-sm text-bone placeholder:text-bone-muted/60 focus:border-gold focus:outline-none";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setSubmitting(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      setSubmitting(false);
      return;
    }

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Failed to reset password.");
      setSubmitting(false);
      return;
    }

    setSuccess(true);
    setSubmitting(false);
  }

  if (!token) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-6">
        <p className="text-xs uppercase tracking-[0.15em] text-gold">Invalid link</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-bone">
          Missing reset token
        </h1>
        <p className="mt-4 text-sm text-bone-muted leading-relaxed">
          This reset link is invalid. Please request a new one.
        </p>
        <Link href="/forgot-password" className="mt-6 text-xs text-gold-bright hover:underline">
          Request new reset link
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-6">
        <p className="text-xs uppercase tracking-[0.15em] text-gold">Done</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-bone">
          Password reset
        </h1>
        <p className="mt-4 text-sm text-bone-muted leading-relaxed">
          Your password has been updated successfully.
        </p>
        <Link href="/login" className="mt-6 text-xs text-gold-bright hover:underline">
          Sign in with new password
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-6">
      <p className="text-xs uppercase tracking-[0.15em] text-gold">Reset password</p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-bone">
        Enter new password
      </h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <input required type="password" placeholder="New password (min 8 characters)" className={inputClass}
          value={password} onChange={(e) => setPassword(e.target.value)} />
        <input required type="password" placeholder="Confirm new password" className={inputClass}
          value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button type="submit" disabled={submitting}
          className="mt-2 w-full border border-gold bg-gold/10 py-3 text-sm tracking-[0.1em] text-gold-bright hover:bg-gold/20 disabled:opacity-50 transition-colors">
          {submitting ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
