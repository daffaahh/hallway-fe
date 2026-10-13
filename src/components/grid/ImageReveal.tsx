"use client";

import Image from "next/image";
import { useRef } from "react";
import { IMAGE_BLOCK, IMAGE_CELLS, cellStyle } from "@/config/grid";
import { IMAGE_DURATION, REVEAL_START } from "@/config/timeline";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { easeOutCubic, segment } from "@/lib/scroll";

/**
 * One photo spread across the open cells. Every cell slides its part of the
 * photo up at the same time.
 */
export default function ImageReveal({ src }: { src: string }) {
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useScrollProgress((p) => {
    const t = easeOutCubic(segment(p, REVEAL_START, IMAGE_DURATION));
    refs.current.forEach((el) => {
      if (el) el.style.transform = `translateY(${(1 - t) * 100}%)`;
    });
  });

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {IMAGE_CELLS.map((cell, i) => (
        <div
          key={i}
          className="absolute overflow-hidden"
          style={cellStyle(cell)}
        >
          <div
            ref={(el) => {
              refs.current[i] = el;
            }}
            className="absolute inset-0 overflow-hidden"
            style={{ transform: "translateY(100%)" }}
          >
            {/* the photo is sized to the whole block and offset per cell */}
            <div
              className="absolute"
              style={{
                width: `${IMAGE_BLOCK.cols * 100}%`,
                height: `${IMAGE_BLOCK.rows * 100}%`,
                left: `-${(cell.col - IMAGE_BLOCK.col) * 100}%`,
                top: `-${(cell.row - IMAGE_BLOCK.row) * 100}%`,
              }}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="40vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
