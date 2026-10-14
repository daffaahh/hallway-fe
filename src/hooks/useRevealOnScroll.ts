"use client";

import { useCallback, useEffect, useRef, type RefObject } from "react";
import { easeOutCubic, segment } from "@/lib/scroll";
import {
  TEXT_DURATION,
  TEXT_EXIT_DURATION,
  TEXT_EXIT_STEP,
  TEXT_STEP,
} from "@/config/timeline";
import { useScrollProgress } from "./useScrollProgress";

/**
 * Slides every `[data-reveal]` element inside `ref` up from behind its mask,
 * in DOM order with a small stagger, starting at scroll progress `start`.
 * With `exitStart` they slide back down at that progress.
 */
export function useRevealOnScroll(
  ref: RefObject<HTMLElement | null>,
  start: number,
  {
    exitStart,
    duration = TEXT_DURATION,
    step = TEXT_STEP,
    exitDuration = TEXT_EXIT_DURATION,
    exitStep = TEXT_EXIT_STEP,
  }: {
    exitStart?: number;
    duration?: number;
    step?: number;
    exitDuration?: number;
    exitStep?: number;
  } = {},
) {
  const lastProgress = useRef(0);

  const apply = useCallback(
    (p: number) => {
      ref.current
        ?.querySelectorAll<HTMLElement>("[data-reveal]")
        .forEach((el, i) => {
          const shown = easeOutCubic(segment(p, start + i * step, duration));
          const hidden =
            exitStart === undefined || el.hasAttribute("data-reveal-persist")
              ? 0
              : easeOutCubic(
                  segment(p, exitStart + i * exitStep, exitDuration),
                );
          el.style.transform = `translateY(${(1 - shown * (1 - hidden)) * 105}%)`;
        });
    },
    [ref, start, duration, step, exitStart, exitDuration, exitStep],
  );

  useScrollProgress((p) => {
    lastProgress.current = p;
    apply(p);
  });

  // Content that mounts later (e.g. re-measured text lines) gets the current state
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new MutationObserver(() => apply(lastProgress.current));
    observer.observe(el, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [ref, apply]);
}
