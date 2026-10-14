"use client";

import { useRef, type ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { SiteLink } from "@/components/ui/SiteLink";
import { FOOTER_WHITE_CELLS, cellStyle, type Cell } from "@/config/grid";
import {
  FOOTER_SHOW_AT,
  FOOTER_SHOW_DURATION,
  FOOTER_SHOW_STEP,
  FOOTER_WHITE_DURATION,
  FOOTER_WHITE_START,
  FOOTER_WHITE_STEP,
} from "@/config/timeline";
import { FOOTER_COPY, NAV_ITEMS } from "@/content/site";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { LINK_HOVER } from "@/lib/styles";
import { segment } from "@/lib/scroll";

const linkClass = "pointer-events-auto block w-fit pb-1";

/** A block positioned on one grid cell, padded like the other sections. */
function Slot({
  cell,
  className = "",
  children,
}: {
  cell: Cell;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`absolute p-8 ${className}`} style={cellStyle(cell)}>
      {children}
    </div>
  );
}

/**
 * Footer, laid out cell by cell on the grid: three cells fade to white and
 * hold the dark links, the rest sits white on the black screen. The text
 * slides up from behind its masks. (The Collaborate button at the top right is
 * the navbar's, which stays.)
 */
export default function FooterSection() {
  const whiteRefs = useRef<(HTMLDivElement | null)[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  useRevealOnScroll(contentRef, FOOTER_SHOW_AT, {
    duration: FOOTER_SHOW_DURATION,
    step: FOOTER_SHOW_STEP,
  });

  useScrollProgress((p) => {
    whiteRefs.current.forEach((el, i) => {
      if (!el) return;
      const t = segment(
        p,
        FOOTER_WHITE_START + i * FOOTER_WHITE_STEP,
        FOOTER_WHITE_DURATION,
      );
      el.style.opacity = String(t);
    });
  });

  return (
    <div className="pointer-events-none absolute inset-0">
      {FOOTER_WHITE_CELLS.map((cell, i) => (
        <div
          key={i}
          ref={(el) => {
            whiteRefs.current[i] = el;
          }}
          aria-hidden
          className="absolute bg-white opacity-0"
          style={cellStyle(cell, " + 1px")}
        />
      ))}

      <div ref={contentRef} className="absolute inset-0">
        {/* row 1: address and email, then the invitation */}
        <Slot
          cell={{ col: 1, row: 0 }}
          className="flex flex-col justify-end gap-5 pb-10 text-sm font-medium leading-snug text-white md:text-base"
        >
          <Reveal>
            <p>{FOOTER_COPY.address}</p>
          </Reveal>
          <Reveal>
            <a
              href={`mailto:${FOOTER_COPY.email}`}
              className={`${linkClass} ${LINK_HOVER}`}
            >
              {FOOTER_COPY.email}
            </a>
          </Reveal>
        </Slot>

        <Slot
          cell={{ col: 2, row: 0 }}
          className="flex items-end justify-end pb-12"
        >
          <Reveal>
            <p className="text-lg font-extrabold uppercase tracking-tight text-white md:text-2xl">
              {FOOTER_COPY.invite}
            </p>
          </Reveal>
        </Slot>

        {/* row 2: page links (white cell) and "Come Find Us" (white cell) */}
        <Slot
          cell={{ col: 0, row: 1 }}
          className="flex flex-col gap-3 pt-10 text-neutral-900"
        >
          {NAV_ITEMS.map((item) => (
            <Reveal key={item.label}>
              <SiteLink
                target={item}
                className={`${linkClass} text-lg font-bold uppercase tracking-wide md:text-2xl ${LINK_HOVER}`}
              >
                {item.label}
              </SiteLink>
            </Reveal>
          ))}
        </Slot>

        <Slot cell={{ col: 3, row: 1 }} className="p-0">
          <SiteLink
            target={FOOTER_COPY.findUs}
            className="group pointer-events-auto flex h-full flex-col justify-between p-8 text-neutral-900"
          >
            <Reveal className="self-end">
              <svg
                width="36"
                height="36"
                viewBox="0 0 36 36"
                fill="none"
                aria-hidden
                className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
              >
                <path
                  d="M6 30L30 6M12 6h18v18"
                  stroke="currentColor"
                  strokeWidth="3"
                />
              </svg>
            </Reveal>
            <Reveal>
              <span className="block text-[clamp(32px,3.6vw,60px)] font-extrabold uppercase leading-[0.95] tracking-tight">
                {FOOTER_COPY.findUs.label}
              </span>
            </Reveal>
          </SiteLink>
        </Slot>

        {/* row 3: copyright, social links (white cell), legal */}
        <Slot
          cell={{ col: 0, row: 2 }}
          className="flex items-end text-sm text-white md:text-base"
        >
          <Reveal>
            <p>{FOOTER_COPY.copyright}</p>
          </Reveal>
        </Slot>

        <Slot
          cell={{ col: 1, row: 2 }}
          className="flex flex-col gap-3 pt-10 text-neutral-900"
        >
          {FOOTER_COPY.social.map((link) => (
            <Reveal key={link.label}>
              <SiteLink
                target={link}
                className={`${linkClass} text-lg font-bold uppercase tracking-wide md:text-2xl ${LINK_HOVER}`}
              >
                {link.label}
              </SiteLink>
            </Reveal>
          ))}
        </Slot>

        <Slot
          cell={{ col: 4, row: 2 }}
          className="flex flex-col justify-end gap-1 text-sm text-white md:text-base"
        >
          {FOOTER_COPY.legal.map((link) => (
            <Reveal key={link.label}>
              <a href={link.href} className={`${linkClass} ${LINK_HOVER}`}>
                {link.label}
              </a>
            </Reveal>
          ))}
        </Slot>
      </div>
    </div>
  );
}
