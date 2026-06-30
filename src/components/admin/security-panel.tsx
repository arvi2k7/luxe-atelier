"use client";

import { useState } from "react";

export function AdminSecurityPanel() {
  const [enabling2FA, setEnabling2FA] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [otpToken, setOtpToken] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [error, setError] = useState("");

  async function handleEnable2FA() {
    setError("");
    try {
      const res = await fetch("/api/auth/2fa/setup", { method: "POST" });
      if (!res.ok) throw new Error("Failed to setup 2FA");
      const data = await res.json();
      setQrCode(data.qrCode);
      setEnabling2FA(true);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function handleVerify() {
    setError("");
    try {
      const res = await fetch("/api/auth/2fa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: otpToken }),
      });
      if (!res.ok) throw new Error("Invalid code");
      setEnabled(true);
      setEnabling2FA(false);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="border border-gold/20 bg-panel p-6">
        <h2 className="font-body text-sm uppercase tracking-[0.12em] text-gold mb-4">Two-Factor Authentication</h2>
        {enabled ? (
          <p className="text-sm text-green-400">2FA is enabled on your account.</p>
        ) : enabling2FA ? (
          <div className="space-y-4">
            <p className="text-sm text-bone-muted">Scan this QR code with your authenticator app:</p>
            {qrCode && (
              <div className="bg-white inline-block p-2 rounded">
                <img src={qrCode} alt="2FA QR Code" className="h-40 w-40" />
              </div>
            )}
            <div className="flex gap-2">
              <input
                placeholder="Enter 6-digit code"
                value={otpToken}
                onChange={(e) => setOtpToken(e.target.value)}
                className="border border-gold/30 bg-transparent px-3 py-2 text-sm text-bone w-40 focus:border-gold focus:outline-none"
              />
              <button onClick={handleVerify}
                className="border border-gold bg-gold/10 px-4 py-2 text-xs text-gold-bright hover:bg-gold/20 transition-colors">
                Verify
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-sm text-bone-muted">Add an extra layer of security to your account.</p>
            <button onClick={handleEnable2FA}
              className="mt-4 border border-gold/30 px-4 py-2 text-xs text-bone-muted hover:border-gold hover:text-bone transition-colors">
              Enable 2FA
            </button>
          </div>
        )}
        {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
      </div>

      <div className="border border-gold/20 bg-panel p-6">
        <h2 className="font-body text-sm uppercase tracking-[0.12em] text-gold mb-4">Staging Mode</h2>
        <p className="text-sm text-bone-muted">
          Staging mode status: {process.env.NEXT_PUBLIC_STAGING_MODE === "true" ? (
            <span className="text-yellow-400">Active — emails will be logged, not sent</span>
          ) : (
            <span className="text-green-400">Inactive — emails will be sent normally</span>
          )}
        </p>
      </div>
    </div>
  );
}
