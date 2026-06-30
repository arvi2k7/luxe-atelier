"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

const inputClass =
  "w-full border border-gold/30 bg-transparent px-3 py-2 text-sm text-bone placeholder:text-bone-muted/60 focus:border-gold focus:outline-none";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/profile";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password.");
      setSubmitting(false);
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-6">
      <p className="text-xs uppercase tracking-[0.15em] text-gold">Welcome back</p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-bone">
        Sign in
      </h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <input required type="email" placeholder="Email" className={inputClass}
          value={email} onChange={(e) => setEmail(e.target.value)} />
        <input required type="password" placeholder="Password" className={inputClass}
          value={password} onChange={(e) => setPassword(e.target.value)} />

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button type="submit" disabled={submitting}
          className="mt-2 w-full border border-gold bg-gold/10 py-3 text-sm tracking-[0.1em] text-gold-bright hover:bg-gold/20 disabled:opacity-50 transition-colors">
          {submitting ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-bone-muted">
        No account?{" "}
        <Link href="/register" className="text-gold-bright hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
