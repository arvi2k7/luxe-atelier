"use client";

export function ExportOrdersButton() {
  return (
    <button
      onClick={() => { window.location.href = "/api/admin/orders/export"; }}
      className="border border-gold/30 px-4 py-2 text-xs text-bone-muted hover:border-gold hover:text-bone transition-colors"
    >
      Export CSV
    </button>
  );
}
