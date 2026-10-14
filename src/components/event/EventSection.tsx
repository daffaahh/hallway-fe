"use client";

import { useRef } from "react";
import { Reveal, RevealLines } from "@/components/ui/Reveal";
import { COLS, colPercent, rowPercent } from "@/config/grid";
import {
  EVENT_EXIT_START,
  EVENT_SHOW_AT,
  EVENT_SHOW_DURATION,
  EVENT_SHOW_STEP,
  EVENT_TEXT_EXIT_DURATION,
  EVENT_TEXT_EXIT_STEP,
} from "@/config/timeline";
import { EVENT_COPY, EVENT_TITLE } from "@/content/site";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";

// breathing room between a column edge and its content
const GUTTER = "2rem";
const LAST_ROW = rowPercent(2);

/** Left edge and width of a run of columns, minus the gutters. */
const columns = (from: number, count: number) => ({
  left: `calc(${colPercent(from)}% + ${GUTTER})`,
  width: `calc(${(count * 100) / COLS}% - 2 * ${GUTTER})`,
});

/**
 * Event section, laid out on the columns of the last grid row: the title at
 * its top, then the paragraph (first three columns) and one button in each of
 * the last two columns, vertically centered in the space between the title and
 * the bottom edge. White on the black left by the transition.
 */
export default function EventSection() {
  const ref = useRef<HTMLDivElement>(null);

  useRevealOnScroll(ref, EVENT_SHOW_AT, {
    duration: EVENT_SHOW_DURATION,
    step: EVENT_SHOW_STEP,
    exitStart: EVENT_EXIT_START,
    exitDuration: EVENT_TEXT_EXIT_DURATION,
    exitStep: EVENT_TEXT_EXIT_STEP,
  });

  const titleColumns = columns(0, 3);

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0">
      {/* the last grid row: the title on top, the rest centered below it */}
      <div
        className="absolute inset-x-0 bottom-0 flex flex-col"
        style={{
          top: `${LAST_ROW}%`,
          paddingTop: GUTTER,
          paddingBottom: GUTTER,
        }}
      >
        <div
          className="shrink-0"
          style={{ marginLeft: titleColumns.left, width: titleColumns.width }}
        >
          <Reveal as="h2" className="py-1">
            <span className="block text-[clamp(32px,4.4vw,72px)] font-medium uppercase leading-none tracking-[0.2em] text-white">
              {EVENT_TITLE}
            </span>
          </Reveal>
        </div>

        <div className="relative flex-1">
          <div
            className="absolute top-1/2 -translate-y-1/2"
            style={columns(0, 3)}
          >
            <RevealLines
              text={EVENT_COPY.paragraph}
              className="relative text-sm font-medium leading-relaxed text-white md:text-[clamp(16px,2.1vh,22px)]"
            />
          </div>

          {EVENT_COPY.buttons.map((button, i) => (
            <div
              key={button.label}
              className="absolute top-1/2 -translate-y-1/2"
              style={columns(3 + i, 1)}
            >
              <Reveal>
                <a
                  href={button.href}
                  className="pointer-events-auto group relative flex min-h-14 items-center overflow-hidden border border-white px-5 py-3 text-xs font-bold uppercase leading-tight tracking-[0.15em] text-white md:text-sm"
                >
                  <span
                    aria-hidden
                    className="absolute inset-0 origin-left scale-x-0 bg-white transition-transform duration-500 ease-out group-hover:scale-x-100"
                  />
                  <span className="relative transition-colors duration-500 group-hover:text-black">
                    {button.label}
                  </span>
                </a>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
