"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

type Suggestion = { _id: string; name: string; slug: string; price: number; images?: string[]; category: string };

export function HeaderSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.length < 2) { setSuggestions([]); return; }
    try {
      const res = await fetch(`/api/search/suggestions?q=${encodeURIComponent(q)}`);
      if (res.ok) setSuggestions(await res.json());
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(query), 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, fetchSuggestions]);

  function handleOpen() {
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  function submitSearch(q: string) {
    if (!q.trim()) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
    setOpen(false);
    setQuery("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    submitSearch(query);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIdx((i) => Math.min(i + 1, suggestions.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIdx((i) => Math.max(i - 1, -1)); }
    if (e.key === "Enter" && selectedIdx >= 0 && suggestions[selectedIdx]) {
      router.push(`/shop/${suggestions[selectedIdx].slug}`);
      setOpen(false);
      setQuery("");
    }
  }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) && !inputRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (!open) {
    return (
      <button onClick={handleOpen} aria-label="Search"
        className="flex items-center text-bone-muted transition-colors hover:text-gold-bright">
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="22" y2="22" />
        </svg>
      </button>
    );
  }

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input ref={inputRef} value={query} onKeyDown={handleKeyDown}
          onChange={(e) => setQuery(e.target.value)}
          onBlur={() => { if (!query && !suggestions.length) setTimeout(() => setOpen(false), 200); }}
          placeholder="Search…"
          className="w-36 border-b border-gold/40 bg-transparent pb-0.5 text-sm text-bone placeholder:text-bone-muted/50 focus:border-gold focus:outline-none transition-colors" />
        <button type="button" onClick={() => { setOpen(false); setQuery(""); }}
          aria-label="Close search"
          className="text-bone-muted hover:text-gold-bright transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </form>
      {suggestions.length > 0 && (
        <div ref={dropdownRef} className="absolute top-full right-0 mt-1 z-dropdown min-w-[280px] bg-panel border border-gold/20">
          {suggestions.map((s, i) => (
            <Link key={s._id} href={`/shop/${s.slug}`}
              className={`flex items-center gap-3 px-4 py-3 transition-colors ${i === selectedIdx ? "bg-vitrine/50" : "hover:bg-vitrine/30"}`}
              onClick={() => { setOpen(false); setQuery(""); }}>
              <div className="w-8 h-8 flex-shrink-0 bg-panel overflow-hidden">
                {s.images?.[0] && <Image src={s.images[0]} alt="" width={32} height={32} className="object-cover w-full h-full" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-bone truncate">{s.name}</p>
                <p className="text-xs text-bone-muted">${s.price.toLocaleString()}</p>
              </div>
            </Link>
          ))}
          <Link href={`/search?q=${encodeURIComponent(query)}`}
            className="block border-t border-gold/10 px-4 py-2 text-xs text-bone-muted hover:text-gold-bright transition-colors text-center"
            onClick={() => { setOpen(false); setQuery(""); }}>
            See all results for &ldquo;{query}&rdquo;
          </Link>
        </div>
      )}
    </div>
  );
}
