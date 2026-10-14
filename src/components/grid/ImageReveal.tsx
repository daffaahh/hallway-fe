"use client";

import Image from "next/image";
import { useRef } from "react";
import { COLS, IMAGE_BLOCK, blockStyle } from "@/config/grid";
import {
  EXIT_START,
  IMAGE_DURATION,
  IMAGE_EXIT_DURATION,
  REVEAL_START,
} from "@/config/timeline";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { easeInOutCubic, easeOutCubic, segment } from "@/lib/scroll";

/**
 * One photo covering the open block of cells. It slides up as a single piece
 * on the way in. On exit it is wiped away in one sweep from its right edge to
 * its left, leaving white behind (not the video).
 */
export default function ImageReveal({ src }: { src: string }) {
  const slideRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);

  useScrollProgress((p) => {
    const slide = easeOutCubic(segment(p, REVEAL_START, IMAGE_DURATION));
    if (slideRef.current) {
      slideRef.current.style.transform = `translateY(${(1 - slide) * 100}%)`;
    }

    const wiped = easeInOutCubic(segment(p, EXIT_START, IMAGE_EXIT_DURATION));
    if (photoRef.current) {
      photoRef.current.style.clipPath = `inset(0 ${wiped * 100}% 0 0)`;
    }
  });

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {/* the white slide layer stays after the photo is wiped away */}
      <div
        className="absolute overflow-hidden"
        style={blockStyle(IMAGE_BLOCK, " + 1px")}
      >
        <div
          ref={slideRef}
          className="absolute inset-0 bg-white"
          style={{ transform: "translateY(100%)" }}
        >
          <div ref={photoRef} className="absolute inset-0">
            <Image
              src={src}
              alt=""
              fill
              sizes={`${(IMAGE_BLOCK.cols / COLS) * 100}vw`}
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
