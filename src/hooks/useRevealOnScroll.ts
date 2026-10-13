"use client";

import { useCallback, useEffect, useRef, type RefObject } from "react";
import { easeOutCubic, segment } from "@/lib/scroll";
import { TEXT_DURATION, TEXT_STEP } from "@/config/timeline";
import { useScrollProgress } from "./useScrollProgress";

/**
 * Slides every `[data-reveal]` element inside `ref` up from behind its mask,
 * in DOM order with a small stagger, starting at scroll progress `start`.
 */
export function useRevealOnScroll(
  ref: RefObject<HTMLElement | null>,
  start: number,
  duration = TEXT_DURATION,
  step = TEXT_STEP,
) {
  const lastProgress = useRef(0);

  const apply = useCallback(
    (p: number) => {
      ref.current
        ?.querySelectorAll<HTMLElement>("[data-reveal]")
        .forEach((el, i) => {
          const t = segment(p, start + i * step, duration);
          el.style.transform = `translateY(${(1 - easeOutCubic(t)) * 105}%)`;
        });
    },
    [ref, start, duration, step],
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
