"use client";

import { useRef } from "react";
import { LINES } from "@/config/grid";
import {
  DRAW_DURATION,
  DRAW_START,
  DRAW_STEP,
  RETRACT_DURATION,
  RETRACT_START,
  RETRACT_STEP,
} from "@/config/timeline";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { segment } from "@/lib/scroll";

/** Thin rules that draw in, then retract back toward where they came from. */
export default function GridLines() {
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useScrollProgress((p) => {
    refs.current.forEach((el, i) => {
      if (!el) return;
      const drawn = segment(p, DRAW_START + i * DRAW_STEP, DRAW_DURATION);
      const retractAt = RETRACT_START + (LINES.length - 1 - i) * RETRACT_STEP;
      const retracted = segment(p, retractAt, RETRACT_DURATION);
      const t = drawn * (1 - retracted);
      el.style.transform =
        LINES[i].axis === "v" ? `scaleY(${t})` : `scaleX(${t})`;
    });
  });

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {LINES.map((line, i) => (
        <div
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          className={`absolute bg-neutral-400/70 ${
            line.axis === "v" ? "inset-y-0 w-px" : "inset-x-0 h-px"
          }`}
          style={{
            ...(line.axis === "v"
              ? { left: `${line.pos}%` }
              : { top: `${line.pos}%` }),
            transformOrigin: line.origin,
            transform: line.axis === "v" ? "scaleY(0)" : "scaleX(0)",
          }}
        />
      ))}
    </div>
  );
}
