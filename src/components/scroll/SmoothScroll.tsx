"use client";

import { useEffect } from "react";
import { clamp } from "@/lib/scroll";

// Time constant (ms) of the easing: higher = floatier, lower = snappier.
const SMOOTHING_MS = 120;

const LINE_HEIGHT_PX = 16;

function insideScrollable(start: EventTarget | null) {
  let el = start instanceof Element ? start : null;
  while (el && el !== document.body && el !== document.documentElement) {
    const { overflowY } = getComputedStyle(el);
    if (/(auto|scroll)/.test(overflowY) && el.scrollHeight > el.clientHeight) {
      return true;
    }
    el = el.parentElement;
  }
  return false;
}

/**
 * Smooths mouse-wheel scrolling: wheel input moves a target position and the
 * page eases toward it. Touch, keyboard and scrollbar dragging stay native.
 * Renders nothing.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let target = window.scrollY;
    let current = window.scrollY;
    let frame = 0;
    let last = 0;

    const maxScroll = () =>
      document.documentElement.scrollHeight - window.innerHeight;

    const tick = (now: number) => {
      const dt = Math.min(now - last, 64);
      last = now;
      const diff = target - current;
      if (Math.abs(diff) < 0.5) {
        current = target;
        window.scrollTo(0, current);
        frame = 0;
        return;
      }
      current += diff * (1 - Math.exp(-dt / SMOOTHING_MS));
      window.scrollTo(0, current);
      frame = requestAnimationFrame(tick);
    };

    const onWheel = (e: WheelEvent) => {
      // leave zoom gestures, locked pages (sidebar open) and inner scrollers alone
      if (e.ctrlKey || e.defaultPrevented) return;
      if (document.body.style.overflow === "hidden") return;
      if (insideScrollable(e.target)) return;

      const unit =
        e.deltaMode === 1
          ? LINE_HEIGHT_PX
          : e.deltaMode === 2
            ? window.innerHeight
            : 1;
      e.preventDefault();
      target = clamp(target + e.deltaY * unit, 0, maxScroll());
      if (!frame) {
        last = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };

    // follow scrolling that did not come from the wheel (keys, scrollbar, anchors)
    const onScroll = () => {
      if (!frame) {
        target = window.scrollY;
        current = window.scrollY;
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
