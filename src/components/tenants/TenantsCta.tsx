"use client";

import { useRef } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { COLS, ROWS, colPercent, rowPercent } from "@/config/grid";
import {
  CTA_DURATION,
  CTA_START,
  TENANT_EXIT_START,
  TENANT_TEXT_EXIT_DURATION,
  TENANT_TEXT_EXIT_STEP,
} from "@/config/timeline";
import { TENANTS_CTA } from "@/content/site";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";

// Centered between the Hobbies and Fashion photos: the two columns in the
// middle of the photo row.
const AREA = {
  left: `${colPercent(2)}%`,
  top: `${rowPercent(1)}%`,
  width: `${(2 * 100) / COLS}%`,
  height: `${100 / ROWS}%`,
};

/**
 * Call to action in the tenants scene: two lines of copy (the first bold, all
 * left-aligned as one block centered between the photos) and a hollow square
 * "Join" button that fills from left to right on hover. It keeps the native
 * cursor and stays clickable while a category is open.
 */
export default function TenantsCta({ live }: { live: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useRevealOnScroll(ref, CTA_START, {
    duration: CTA_DURATION,
    exitStart: TENANT_EXIT_START,
    exitDuration: TENANT_TEXT_EXIT_DURATION,
    exitStep: TENANT_TEXT_EXIT_STEP,
  });

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute z-10 flex items-center justify-center pb-8 pr-20 md:pb-10 md:pr-36"
      style={AREA}
    >
      <div className="flex flex-col items-start text-left">
        {TENANTS_CTA.lines.map((line, i) => (
          <Reveal key={line}>
            <p
              className={`py-0.5 text-[clamp(20px,2.4vw,40px)] leading-tight text-neutral-900 ${
                i === 0 ? "font-bold" : "font-medium"
              }`}
            >
              {line}
            </p>
          </Reveal>
        ))}

        <Reveal className="mt-5 md:mt-6">
          <a
            href="#"
            data-cursor-native
            className={`group relative flex overflow-hidden border border-neutral-900 px-8 py-3 text-sm font-bold uppercase tracking-[0.2em] text-neutral-900 md:px-10 md:text-base ${
              live ? "pointer-events-auto" : "pointer-events-none"
            }`}
          >
            <span
              aria-hidden
              className="absolute inset-0 origin-left scale-x-0 bg-neutral-900 transition-transform duration-500 ease-out group-hover:scale-x-100"
            />
            <span className="relative transition-colors duration-500 group-hover:text-white">
              {TENANTS_CTA.button}
            </span>
          </a>
        </Reveal>
      </div>
    </div>
  );
}
