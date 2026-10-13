"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";
import {
  ScrollStageContext,
  type ProgressListener,
} from "@/hooks/useScrollProgress";
import { SCROLL_LENGTH } from "@/config/timeline";
import { clamp, easeInOutCubic } from "@/lib/scroll";

// how long scrolling must be idle before the stage settles
const SETTLE_DELAY_MS = 150;
const SETTLE_EPSILON = 0.005;
// events that mean the user took over the scroll again
const USER_INPUT_EVENTS = ["wheel", "touchstart", "keydown", "mousedown"];

/**
 * A tall scroll area with a sticky full-screen stage. Scrolling through it
 * produces a progress value (0..1) that children read via useScrollProgress.
 *
 * With `snapFrom`, letting go of the scroll snaps the stage: scrolling down
 * past that progress finishes the stage; anything else returns to the start.
 * `snapDuration` (ms) sets how slowly that glide runs.
 */
export default function ScrollStage({
  children,
  length = SCROLL_LENGTH,
  snapFrom,
  snapDuration = 3570,
}: {
  children: ReactNode;
  length?: string;
  snapFrom?: number;
  snapDuration?: number;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listeners = useRef(new Set<ProgressListener>());
  const progress = useRef(0);

  const subscribe = useCallback((listener: ProgressListener) => {
    listeners.current.add(listener);
    listener(progress.current);
    return () => {
      listeners.current.delete(listener);
    };
  }, []);

  useEffect(() => {
    let frame = 0;
    let settleTimer: ReturnType<typeof setTimeout> | undefined;
    let lastY = window.scrollY;
    let direction = 1;
    let glide = 0;

    const cancelGlide = () => {
      if (glide) cancelAnimationFrame(glide);
      glide = 0;
    };

    // window.scrollTo's smooth behavior has a fixed speed, so animate by hand
    const glideTo = (target: number) => {
      cancelGlide();
      const from = window.scrollY;
      const startedAt = performance.now();
      const step = (now: number) => {
        const t = clamp((now - startedAt) / snapDuration);
        window.scrollTo(0, from + (target - from) * easeInOutCubic(t));
        glide = t < 1 ? requestAnimationFrame(step) : 0;
      };
      glide = requestAnimationFrame(step);
    };

    const measure = () => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return null;
      const distance = wrapper.offsetHeight - window.innerHeight;
      const top = window.scrollY + wrapper.getBoundingClientRect().top;
      return { distance, top };
    };

    const update = () => {
      frame = 0;
      const m = measure();
      if (!m) return;
      progress.current =
        m.distance > 0 ? clamp((window.scrollY - m.top) / m.distance) : 0;
      listeners.current.forEach((listener) => listener(progress.current));
    };

    const settle = () => {
      const m = measure();
      if (!m || snapFrom === undefined || m.distance <= 0) return;
      const p = progress.current;
      if (p < SETTLE_EPSILON || p > 1 - SETTLE_EPSILON) return;

      // only scrolling down past the trigger finishes the stage
      const target = p >= snapFrom && direction > 0 ? 1 : 0;
      glideTo(m.top + target * m.distance);
    };

    const onScroll = () => {
      if (window.scrollY !== lastY) {
        direction = window.scrollY > lastY ? 1 : -1;
        lastY = window.scrollY;
      }
      if (!frame) frame = requestAnimationFrame(update);
      clearTimeout(settleTimer);
      if (!glide) settleTimer = setTimeout(settle, SETTLE_DELAY_MS);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    USER_INPUT_EVENTS.forEach((e) =>
      window.addEventListener(e, cancelGlide, { passive: true }),
    );
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      USER_INPUT_EVENTS.forEach((e) =>
        window.removeEventListener(e, cancelGlide),
      );
      cancelGlide();
      if (frame) cancelAnimationFrame(frame);
      clearTimeout(settleTimer);
    };
  }, [snapFrom, snapDuration]);

  return (
    <ScrollStageContext.Provider value={subscribe}>
      <div ref={wrapperRef} className="relative" style={{ height: length }}>
        <section className="sticky top-0 h-screen w-full overflow-hidden bg-white">
          {children}
        </section>
      </div>
    </ScrollStageContext.Provider>
  );
}
