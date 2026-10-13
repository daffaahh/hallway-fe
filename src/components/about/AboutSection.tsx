"use client";

import { useRef } from "react";
import { Reveal, RevealLines } from "@/components/ui/Reveal";
import { IMAGE_BLOCK, colPercent, rowPercent } from "@/config/grid";
import { REVEAL_START } from "@/config/timeline";
import { ABOUT_TEXT, ABOUT_TITLE } from "@/content/site";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { LINK_HOVER } from "@/lib/styles";

// Text sits right of the photo block, in the same row
const TEXT_ROW_TOP = rowPercent(IMAGE_BLOCK.row);
const TEXT_LEFT = colPercent(IMAGE_BLOCK.col + IMAGE_BLOCK.cols) + 2;

/** Title above the photo, intro paragraph and call to action beside it. */
export default function AboutSection() {
  const ref = useRef<HTMLDivElement>(null);

  useRevealOnScroll(ref, REVEAL_START);

  return (
    <div ref={ref}>
      <Reveal
        as="h2"
        className="absolute left-6 -translate-y-full text-xl font-medium uppercase tracking-[0.2em] text-neutral-900 md:left-12 md:text-3xl"
        style={{ top: `${TEXT_ROW_TOP}%` }}
      >
        <span className="block pb-4">{ABOUT_TITLE}</span>
      </Reveal>

      <div
        className="absolute right-6 max-w-2xl md:right-auto md:w-[55%]"
        style={{
          left: `${TEXT_LEFT}%`,
          top: `calc(${TEXT_ROW_TOP}% + 1.5rem)`,
        }}
      >
        <RevealLines
          text={ABOUT_TEXT}
          className="relative text-[11px] leading-relaxed text-neutral-800 md:text-base"
        />
        <Reveal className="mt-6 w-fit">
          <a
            href="#"
            className={`block pb-1 text-xs font-bold uppercase tracking-wide text-neutral-900 md:text-base ${LINK_HOVER}`}
          >
            Learn More ++
          </a>
        </Reveal>
      </div>
    </div>
  );
}
