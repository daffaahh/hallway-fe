"use client";

import { useRef, useState, type ReactNode } from "react";
import { PlusLabel } from "@/components/ui/PlusLabel";
import { Reveal } from "@/components/ui/Reveal";
import { colPercent } from "@/config/grid";
import { TITLE_DURATION, TITLE_START } from "@/config/timeline";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";

const MS = 600;
// keeps the list the right height before the first category is opened
const PLACEHOLDER_NAMES = ["", "", ""];

/** Clips its child and slides it up from behind the edge when `open`. */
function SlideUp({
  open,
  delay,
  children,
}: {
  open: boolean;
  delay: number;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden">
      <div
        className="transition-transform ease-out"
        style={{
          transform: open ? "translateY(0)" : "translateY(110%)",
          transitionDuration: `${MS}ms`,
          transitionDelay: open ? `${delay}ms` : "0ms",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * Sits next to the bottom-left title. "Learn More ++" is always there; while a
 * category is open its tenant list slides up above it.
 */
export default function TenantPanel({
  category,
  names,
}: {
  /** the open category, or null when none is open */
  category: string | null;
  /** the open category's tenants, or null when none is open */
  names: string[] | null;
}) {
  const open = category !== null;
  const learnMoreRef = useRef<HTMLDivElement>(null);

  useRevealOnScroll(learnMoreRef, TITLE_START + TITLE_DURATION * 0.4, {
    duration: TITLE_DURATION,
  });

  // keep the last category so the text can slide away before it is replaced
  const [lastCategory, setLastCategory] = useState(category);
  if (category && category !== lastCategory) setLastCategory(category);
  const [lastNames, setLastNames] = useState<string[]>(PLACEHOLDER_NAMES);
  if (names && names !== lastNames) setLastNames(names);

  return (
    <div
      className="pointer-events-none absolute bottom-6 md:bottom-10"
      style={{ left: `calc(${colPercent(2)}% + 0.5rem)` }}
    >
      <SlideUp open={open} delay={0}>
        <p
          aria-hidden={!open}
          className="pb-3 text-xs font-bold uppercase tracking-[0.2em] text-neutral-500 md:text-sm"
        >
          {lastCategory}
        </p>
      </SlideUp>
      <ul aria-hidden={!open}>
        {lastNames.map((name, i) => (
          <li key={i}>
            <SlideUp open={open} delay={120 + i * 100}>
              <span className="block py-0.5 text-lg font-bold uppercase tracking-wide text-neutral-900 md:text-2xl">
                {name}
              </span>
            </SlideUp>
          </li>
        ))}
      </ul>

      <div ref={learnMoreRef} className="relative z-10 mt-6 w-fit">
        <Reveal>
          <a
            href="#"
            data-cursor-native
            className="group pointer-events-auto block text-sm font-bold uppercase tracking-wide text-neutral-900 md:text-[clamp(14px,1.9vh,20px)]"
          >
            <PlusLabel>Learn More</PlusLabel>
          </a>
        </Reveal>
      </div>
    </div>
  );
}
