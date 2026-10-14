"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { type Cell, cellStyle } from "@/config/grid";
import {
  PHOTO_DURATION,
  TENANT_PHOTO_EXIT_DURATION,
  TENANT_TEXT_EXIT_DURATION,
} from "@/config/timeline";
import { type TenantPhoto } from "@/content/site";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { easeOutCubic, segment } from "@/lib/scroll";

const SLIDE_MS = 700;

/**
 * A photo that slides up inside its grid cell (driven by scroll), with its
 * label above it. A category can be opened from it: `overlay` slides another
 * photo up over the cell, and slides back down when it becomes null.
 */
export default function TenantCard({
  cell,
  label,
  src,
  zoom,
  labelSide,
  start,
  exitStart,
  overlay,
  overlayDelay,
  selectable,
  onSelect,
  live,
}: {
  cell: Cell;
  label: string;
  src: string;
  zoom: number;
  /** which edge of the photo the label lines up with */
  labelSide: "left" | "right";
  /** scroll progress at which the photo starts sliding up */
  start: number;
  /** scroll progress at which the photo and label slide away again */
  exitStart: number;
  /** whether the card can be clicked (the scene is still on screen) */
  live: boolean;
  /** photo to slide over this one, or null for none */
  overlay: TenantPhoto | null;
  overlayDelay: number;
  selectable: boolean;
  onSelect: () => void;
}) {
  const slideRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  // keep the last overlay around so it can slide back down after it is cleared
  const [lastOverlay, setLastOverlay] = useState(overlay);
  if (overlay && overlay !== lastOverlay) setLastOverlay(overlay);

  // mount the overlay below the cell first, then raise it so it animates in
  const [raised, setRaised] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setRaised(overlay !== null));
    return () => cancelAnimationFrame(id);
  }, [overlay]);

  useRevealOnScroll(labelRef, start + PHOTO_DURATION * 0.5, {
    exitStart,
    exitDuration: TENANT_TEXT_EXIT_DURATION,
  });

  useScrollProgress((p) => {
    const shown = easeOutCubic(segment(p, start, PHOTO_DURATION));
    const gone = easeOutCubic(
      segment(p, exitStart, TENANT_PHOTO_EXIT_DURATION),
    );
    const t = shown * (1 - gone);
    if (slideRef.current) {
      slideRef.current.style.transform = `translateY(${(1 - t) * 100}%)`;
    }
  });

  return (
    <div
      className={`absolute ${live ? "pointer-events-auto" : "pointer-events-none"}`}
      data-cursor-label={selectable ? "Learn more" : undefined}
      role={selectable ? "button" : undefined}
      tabIndex={selectable ? 0 : undefined}
      aria-label={selectable ? `Open ${label} tenants` : undefined}
      onClick={selectable ? onSelect : undefined}
      onKeyDown={
        selectable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect();
              }
            }
          : undefined
      }
      style={cellStyle(cell, " + 1px")}
    >
      <div
        ref={labelRef}
        className={`absolute bottom-full mb-2 md:mb-3 ${
          labelSide === "right" ? "right-0" : "left-0"
        }`}
      >
        <Reveal>
          <p className="py-0.5 text-sm font-bold uppercase tracking-wide text-neutral-900 md:text-xl">
            {label}
          </p>
        </Reveal>
      </div>

      <div className="absolute inset-0 overflow-hidden">
        <div
          ref={slideRef}
          className="absolute inset-0 overflow-hidden"
          style={{ transform: "translateY(100%)" }}
        >
          <Image
            src={src}
            alt={label}
            fill
            sizes="20vw"
            loading="eager"
            className="object-cover"
            style={{ transform: `scale(${zoom})` }}
          />

          {lastOverlay && (
            <div
              className="absolute inset-0 overflow-hidden transition-transform ease-out"
              style={{
                transform: raised ? "translateY(0)" : "translateY(100%)",
                transitionDuration: `${SLIDE_MS}ms`,
                transitionDelay: `${overlayDelay}ms`,
              }}
            >
              <Image
                src={lastOverlay.src}
                alt=""
                fill
                sizes="20vw"
                loading="eager"
                className="object-cover"
                style={{ transform: `scale(${lastOverlay.zoom})` }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
