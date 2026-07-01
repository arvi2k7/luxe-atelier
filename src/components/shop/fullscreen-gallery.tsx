"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";

export function FullscreenGallery({
  images, initialIndex, productName, onClose,
}: {
  images: string[];
  initialIndex: number;
  productName: string;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(initialIndex);
  const [touchStart, setTouchStart] = useState(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setCurrent((i) => Math.max(0, i - 1));
      if (e.key === "ArrowRight") setCurrent((i) => Math.min(images.length - 1, i + 1));
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handler);
    };
  }, [images.length, onClose]);

  const goNext = useCallback(() => setCurrent((i) => Math.min(images.length - 1, i + 1)), [images.length]);
  const goPrev = useCallback(() => setCurrent((i) => Math.max(0, i - 1)), []);

  return (
    <div className="fixed inset-0 z-modal flex flex-col bg-black">
      <div className="flex items-center justify-between px-6 py-4">
        <span className="text-sm text-bone-muted">{current + 1} / {images.length}</span>
        <button onClick={onClose} className="text-2xl text-bone-muted hover:text-bone leading-none">&times;</button>
      </div>
      <div className="flex-1 flex items-center justify-center relative overflow-hidden"
        onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
        onTouchEnd={(e) => {
          const delta = e.changedTouches[0].clientX - touchStart;
          if (Math.abs(delta) > 50) {
            if (delta > 0) goPrev();
            else goNext();
          }
        }}>
        {current > 0 && (
          <button onClick={goPrev} className="absolute left-4 z-10 w-12 h-12 border border-gold/30 flex items-center justify-center text-bone-muted hover:text-bone hover:border-gold transition-colors text-xl">
            &#8249;
          </button>
        )}
        <Image src={images[current]} alt={`${productName} ${current + 1}`} fill
          className="object-contain"
          sizes="90vw" />
        {current < images.length - 1 && (
          <button onClick={goNext} className="absolute right-4 z-10 w-12 h-12 border border-gold/30 flex items-center justify-center text-bone-muted hover:text-bone hover:border-gold transition-colors text-xl">
            &#8250;
          </button>
        )}
      </div>
      <div className="flex gap-2 px-4 py-4 overflow-x-auto justify-center">
        {images.map((img, i) => (
          <button key={i} onClick={() => setCurrent(i)} className="flex-shrink-0 w-16 h-16 overflow-hidden border-2 transition-colors"
            style={{ borderColor: i === current ? "#D4C28F" : "rgba(184,168,135,0.2)" }}>
            <Image src={img} alt="" width={64} height={64} className="object-cover w-full h-full" />
          </button>
        ))}
      </div>
    </div>
  );
}
