"use client";

import Image from "next/image";
import { useState } from "react";
import { ZoomableImage } from "./zoomable-image";
import { FullscreenGallery } from "./fullscreen-gallery";

type Props = {
  images: string[];
  name: string;
};

export function ImageGallery({ images, name }: Props) {
  const [selected, setSelected] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  if (!images.length) {
    return (
      <div className="aspect-[3/4] overflow-hidden bg-gradient-to-br from-panel via-vitrine to-black" />
    );
  }

  const showThumbnails = images.length > 1;

  return (
    <>
      <div className="flex flex-col gap-3 md:flex-row">
        {showThumbnails && (
          <div className="order-1 flex flex-row gap-2 md:order-[-1] md:flex-col">
            {images.map((url, i) => (
              <button
                key={url}
                onClick={() => setSelected(i)}
                className={`h-16 w-16 flex-shrink-0 overflow-hidden border transition-colors ${
                  i === selected
                    ? "border-gold-bright"
                    : "border-gold/20 hover:border-gold/50"
                }`}
              >
                <Image
                  src={url}
                  alt={`${name} thumbnail ${i + 1}`}
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
        <div className="relative flex-1">
          <ZoomableImage src={images[selected]} alt={name} priority={selected === 0} />
          <button onClick={() => setFullscreen(true)}
            className="absolute bottom-3 right-3 z-10 border border-gold/30 bg-vitrine/80 p-2 text-bone-muted hover:text-bone hover:border-gold transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" />
              <line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
            </svg>
          </button>
        </div>
      </div>
      {fullscreen && (
        <FullscreenGallery images={images} initialIndex={selected} productName={name} onClose={() => setFullscreen(false)} />
      )}
    </>
  );
}
