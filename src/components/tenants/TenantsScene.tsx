"use client";

import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import {
  TENANT_BLACK_CELLS,
  TENANT_PHOTO_CELLS,
  cellStyle,
} from "@/config/grid";
import {
  BLACK_DURATION,
  BLACK_START,
  BLACK_STEP,
  PHOTO_START,
  PHOTO_STEP,
  TENANT_EXIT_START,
  TENANT_PHOTO_EXIT_STEP,
  TENANT_TEXT_EXIT_DURATION,
  TENANT_TEXT_EXIT_STEP,
  TITLE_DURATION,
  TITLE_START,
} from "@/config/timeline";
import { TENANTS_TITLE, TENANT_CARDS } from "@/content/site";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { segment } from "@/lib/scroll";
import TenantCard from "./TenantCard";
import TenantPanel from "./TenantPanel";
import TenantsCta from "./TenantsCta";

const OVERLAY_STAGGER_MS = 150;

/**
 * Tenants scene: two cells fade to black, three labelled photos slide up one
 * after another, and the title rises in the bottom-left corner.
 *
 * After a pause the whole scene slides away (see EventTransition).
 *
 * Clicking a photo opens its category: the other two photos are replaced by
 * that category's two sub photos (sliding up), the cards are relabelled
 * after its tenants and a tenant list appears. A click anywhere (or Esc) closes it
 * and brings the other categories back; the cursor reads "Close" meanwhile.
 */
export default function TenantsScene() {
  const blackRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string | null>(null);
  // false once the scene has started leaving (or has not arrived yet)
  const [live, setLive] = useState(true);

  useRevealOnScroll(titleRef, TITLE_START, {
    duration: TITLE_DURATION,
    exitStart: TENANT_EXIT_START,
    exitDuration: TENANT_TEXT_EXIT_DURATION,
    exitStep: TENANT_TEXT_EXIT_STEP,
  });

  useScrollProgress((p) => {
    blackRefs.current.forEach((el, i) => {
      if (!el) return;
      const t = segment(p, BLACK_START + i * BLACK_STEP, BLACK_DURATION);
      el.style.opacity = String(t);
    });
    // leaving the scene in either direction closes an open category
    const inScene = p >= BLACK_START && p < TENANT_EXIT_START;
    setLive(inScene);
    if (!inScene) setActive((current) => (current ? null : current));
  });

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  const activeCard = TENANT_CARDS.find((card) => card.label === active);
  let replaced = 0;

  return (
    <div className="pointer-events-none absolute inset-0">
      {TENANT_BLACK_CELLS.map((cell, i) => (
        <div
          key={`black-${i}`}
          ref={(el) => {
            blackRefs.current[i] = el;
          }}
          aria-hidden
          className="absolute bg-black opacity-0"
          style={cellStyle(cell, " + 1px")}
        />
      ))}

      {TENANT_PHOTO_CELLS.map((cell, i) => {
        const card = TENANT_CARDS[i];
        // the open card stays; every other card gets one of its sub photos
        const overlay =
          activeCard && activeCard !== card
            ? activeCard.subPhotos[replaced++]
            : null;
        return (
          <TenantCard
            key={card.label}
            cell={cell}
            label={activeCard ? (overlay?.name ?? card.name) : card.label}
            src={card.src}
            zoom={card.zoom}
            labelSide={card.labelSide}
            start={PHOTO_START + i * PHOTO_STEP}
            exitStart={TENANT_EXIT_START + i * TENANT_PHOTO_EXIT_STEP}
            live={live}
            overlay={overlay}
            overlayDelay={overlay ? replaced * OVERLAY_STAGGER_MS : 0}
            selectable={!activeCard}
            onSelect={() => setActive(card.label)}
          />
        );
      })}

      <TenantsCta live={live} />

      <TenantPanel
        category={active}
        names={activeCard?.tenants ?? null}
        live={live}
      />

      {/* while a category is open, a click anywhere closes it */}
      {active && (
        <button
          type="button"
          aria-label="Close"
          data-cursor-label="Close"
          onClick={() => setActive(null)}
          className="pointer-events-auto absolute inset-0"
        />
      )}

      <div
        ref={titleRef}
        className="absolute bottom-6 left-6 md:bottom-10 md:left-12"
      >
        <Reveal as="h2" className="py-1">
          <span className="block text-[clamp(32px,4.4vw,72px)] font-medium uppercase leading-none tracking-[0.2em] text-neutral-900">
            {TENANTS_TITLE}
          </span>
        </Reveal>
      </div>
    </div>
  );
}
