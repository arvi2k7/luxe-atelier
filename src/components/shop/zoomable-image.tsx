"use client";

import { useRef, useState, useCallback } from "react";
import Image from "next/image";

export function ZoomableImage({ src, alt, priority }: { src: string; alt: string; priority?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin(`${x}% ${y}%`);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative z-0 aspect-[3/4] overflow-hidden bg-panel cursor-crosshair"
      onMouseEnter={() => setZoom(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setZoom(false)}
    >
      <Image
        src={src} alt={alt} fill priority={priority}
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover"
        style={{
          ...(zoom ? { transform: "scale(2)", transformOrigin: origin } : {}),
          transition: zoom ? "none" : "transform 0.1s ease-out",
        }}
      />
    </div>
  );
}
