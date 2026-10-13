"use client";

import { useRef } from "react";
import { COLS, COVER_CELLS, cellStyle } from "@/config/grid";
import { COVER_DURATION, COVER_START, COVER_STEP } from "@/config/timeline";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { segment } from "@/lib/scroll";

/** White panels that drop over the cells, column by column from the right. */
export default function CoverPanels() {
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useScrollProgress((p) => {
    refs.current.forEach((el, i) => {
      if (!el) return;
      const start = COVER_START + (COLS - 1 - COVER_CELLS[i].col) * COVER_STEP;
      el.style.transform = `scaleY(${segment(p, start, COVER_DURATION)})`;
    });
  });

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {COVER_CELLS.map((cell, i) => (
        <div
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          className="absolute bg-white"
          style={{
            ...cellStyle(cell, " + 1px"),
            transformOrigin: "top",
            transform: "scaleY(0)",
          }}
        />
      ))}
    </div>
  );
}
