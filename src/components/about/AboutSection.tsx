"use client";

import { useRef } from "react";
import { PlusLabel } from "@/components/ui/PlusLabel";
import { Reveal, RevealLines } from "@/components/ui/Reveal";
import { IMAGE_BLOCK, colPercent, rowPercent } from "@/config/grid";
import { EXIT_START, REVEAL_START } from "@/config/timeline";
import { ABOUT_PARAGRAPHS, ABOUT_TITLE, OPEN_HOURS } from "@/content/site";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";

// Opening hours sit under the photo, flush with its right edge
const PHOTO_BOTTOM = rowPercent(IMAGE_BLOCK.row + IMAGE_BLOCK.rows);
const PHOTO_RIGHT_GAP = 100 - colPercent(IMAGE_BLOCK.col + IMAGE_BLOCK.cols);

// Text sits right of the photo block, in the same row
const TEXT_ROW_TOP = rowPercent(IMAGE_BLOCK.row);
const TEXT_LEFT = colPercent(IMAGE_BLOCK.col + IMAGE_BLOCK.cols) + 5;

/** Title above the photo, intro paragraph and call to action beside it. */
export default function AboutSection() {
  const ref = useRef<HTMLDivElement>(null);

  useRevealOnScroll(ref, REVEAL_START, { exitStart: EXIT_START });

  return (
    <div ref={ref}>
      <Reveal
        as="h2"
        className="absolute left-6 -translate-y-full text-2xl font-medium uppercase tracking-[0.2em] text-neutral-900 md:left-12 md:text-5xl"
        style={{ top: `${TEXT_ROW_TOP}%` }}
      >
        <span className="block pb-4">{ABOUT_TITLE}</span>
      </Reveal>

      <div
        className="absolute right-6 max-w-2xl md:right-auto md:w-[24%]"
        style={{
          left: `${TEXT_LEFT}%`,
          top: `calc(${TEXT_ROW_TOP}% + 8vh)`,
        }}
      >
        {ABOUT_PARAGRAPHS.map((text, i) => (
          <RevealLines
            key={i}
            text={text}
            className={`relative text-xs font-medium leading-relaxed text-neutral-800 md:text-[clamp(14px,1.9vh,20px)] ${
              i > 0 ? "mt-6" : ""
            }`}
          />
        ))}
        <Reveal className="mt-10 w-fit">
          <a
            href="#"
            className="group block text-sm font-bold uppercase tracking-wide text-neutral-900 md:text-[clamp(14px,1.9vh,20px)]"
          >
            <PlusLabel>Learn More</PlusLabel>
          </a>
        </Reveal>
      </div>

      <Reveal
        className="absolute"
        style={{
          top: `calc(${PHOTO_BOTTOM}% + 1.5rem)`,
          right: `${PHOTO_RIGHT_GAP}%`,
        }}
      >
        <p className="text-sm font-bold uppercase tracking-wide text-neutral-900 md:text-[clamp(14px,1.9vh,20px)]">
          {OPEN_HOURS}
        </p>
      </Reveal>
    </div>
  );
}
