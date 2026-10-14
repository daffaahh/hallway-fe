"use client";

import { useRef } from "react";
import { COLS, ROWS, type Cell, cellStyle } from "@/config/grid";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { clamp, segment } from "@/lib/scroll";

/**
 * Panels that grow over a set of cells, one column after another from the
 * right to the left. Each panel grows from its `origin` edge.
 *
 * With `rise` (for origin "bottom") a column fills as one continuous sweep
 * from its bottom cell up to its top cell, instead of every cell in the column
 * growing at once.
 *
 * With `release` the top `rows` rows later sink back down the same way, column
 * by column, uncovering whatever lies behind them. With `refill` they then
 * rise again, column by column, covering it back up.
 */
export default function CoverPanels({
  cells,
  start,
  step,
  duration,
  fill,
  origin,
  rise = false,
  release,
  refill,
}: {
  cells: Cell[];
  /** scroll progress at which the rightmost column starts */
  start: number;
  /** delay between one column and the next */
  step: number;
  duration: number;
  /** a full Tailwind background class, e.g. "bg-white" */
  fill: string;
  origin: "top" | "bottom";
  rise?: boolean;
  release?: { start: number; step: number; duration: number; rows: number };
  refill?: { start: number; step: number; duration: number };
}) {
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useScrollProgress((p) => {
    refs.current.forEach((el, i) => {
      if (!el) return;
      const { col, row } = cells[i];
      const column = segment(p, start + (COLS - 1 - col) * step, duration);
      // a column of ROWS cells fills bottom to top: each cell takes its slice
      const grown = rise ? clamp(column * ROWS - (ROWS - 1 - row)) : column;
      let scale = grown;
      if (release && row < release.rows) {
        const sunk = segment(
          p,
          release.start + (COLS - 1 - col) * release.step,
          release.duration,
        );
        // the released block of rows shrinks from its top edge down
        const left = release.rows * (1 - sunk);
        scale = Math.min(scale, clamp(left - (release.rows - 1 - row)));
        if (refill) {
          const again = segment(
            p,
            refill.start + (COLS - 1 - col) * refill.step,
            refill.duration,
          );
          const risen = clamp(again * release.rows - (release.rows - 1 - row));
          scale = Math.max(scale, risen);
        }
      }
      el.style.transform = `scaleY(${scale})`;
    });
  });

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {cells.map((cell, i) => (
        <div
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          className={`absolute ${fill}`}
          style={{
            ...cellStyle(cell, " + 1px"),
            transformOrigin: origin,
            transform: "scaleY(0)",
          }}
        />
      ))}
    </div>
  );
}
