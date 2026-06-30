"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

const inputClass =
  "w-full border border-gold/30 bg-transparent px-3 py-2 text-sm text-bone placeholder:text-bone-muted/60 focus:border-gold focus:outline-none";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Registration failed.");
      setSubmitting(false);
      return;
    }

    const signInRes = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    if (signInRes?.error) {
      router.push("/login");
      return;
    }

    router.push("/profile");
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-6">
      <p className="text-xs uppercase tracking-[0.15em] text-gold">Create account</p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-bone">
        Join Luxe Atelier
      </h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <input required placeholder="Full name" className={inputClass}
          value={form.name} onChange={(e) => update("name", e.target.value)} />
        <input required type="email" placeholder="Email" className={inputClass}
          value={form.email} onChange={(e) => update("email", e.target.value)} />
        <input required type="password" placeholder="Password (min 8 characters)"
          className={inputClass} value={form.password}
          onChange={(e) => update("password", e.target.value)} />

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button type="submit" disabled={submitting}
          className="mt-2 w-full border border-gold bg-gold/10 py-3 text-sm tracking-[0.1em] text-gold-bright hover:bg-gold/20 disabled:opacity-50 transition-colors">
          {submitting ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-bone-muted">
        Already have an account?{" "}
        <Link href="/login" className="text-gold-bright hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
