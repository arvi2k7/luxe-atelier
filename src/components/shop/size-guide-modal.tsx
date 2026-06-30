"use client";

import { useEffect, useState } from "react";
import { SIZE_GUIDE } from "@/lib/size-guide";

export function SizeGuideModal({ category }: { category: string }) {
  const [open, setOpen] = useState(false);

  const guide = SIZE_GUIDE[category];
  if (!guide) return null;

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}
        className="text-xs text-bone-muted underline hover:text-gold-bright transition-colors">
        Size guide
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
          <div className="mx-4 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-gold/20 bg-panel p-8">
            <div className="flex justify-between items-start mb-6">
              <p className="text-xs uppercase tracking-[0.15em] text-gold">Size guide — {category}</p>
              <button onClick={() => setOpen(false)} className="text-bone-muted hover:text-bone text-lg leading-none">&times;</button>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gold/20">
                  {guide.columns.map((col) => (
                    <th key={col} className="pb-3 text-xs uppercase tracking-[0.12em] text-gold font-normal pr-4">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {guide.rows.map((row) => (
                  <tr key={row.size} className="even:bg-vitrine/30">
                    <td className="py-3 pr-4 text-sm text-bone font-medium">{row.size}</td>
                    {row.measurements.map((m, i) => (
                      <td key={i} className="py-3 pr-4 text-sm text-bone-muted">{m}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {guide.note && <p className="mt-6 text-xs text-bone-muted italic">{guide.note}</p>}
          </div>
        </div>
      )}
    </>
  );
}
