"use client";

import { useEffect, useRef, useState } from "react";
import { BLACK_START, TENANT_EXIT_START } from "@/config/timeline";
import { useScrollProgress } from "@/hooks/useScrollProgress";

const DEFAULT_LABEL = "Click one";
// share of the remaining distance covered each frame: lower = floatier
const FOLLOW = 0.2;
// ring diameters in px; it grows a little over something clickable
const SIZE = 72;
const SIZE_HOVER = 88;

/**
 * Replaces the mouse cursor in the tenants scene with a hollow circle. It says
 * "Click one" and switches to the label of whatever it hovers (elements with
 * `data-cursor-label`, e.g. a tenant photo or its label). The native cursor
 * returns over the navbar, dialogs and anything marked `data-cursor-native`
 * (e.g. the Learn More link), and outside the scene. Mouse only.
 */
export default function TenantsCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const [label, setLabel] = useState(DEFAULT_LABEL);
  const [shown, setShown] = useState(false);

  useScrollProgress((p) => {
    progress.current = p;
  });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const root = document.documentElement;
    let x = 0;
    let y = 0;
    let cx = 0;
    let cy = 0;
    let frame = 0;
    let active = false;

    const inScene = () =>
      progress.current >= BLACK_START && progress.current < TENANT_EXIT_START;

    const loop = () => {
      if (!inScene()) {
        setActive(false);
        return;
      }
      cx += (x - cx) * FOLLOW;
      cy += (y - cy) * FOLLOW;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${Math.round(cx)}px, ${Math.round(cy)}px, 0)`;
      }
      frame = requestAnimationFrame(loop);
    };

    function setActive(next: boolean) {
      if (next === active) return;
      active = next;
      setShown(next);
      if (next) {
        root.setAttribute("data-custom-cursor", "");
        cx = x;
        cy = y;
        frame = requestAnimationFrame(loop);
      } else {
        root.removeAttribute("data-custom-cursor");
        cancelAnimationFrame(frame);
        setLabel(DEFAULT_LABEL);
      }
    }

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      const target = e.target instanceof Element ? e.target : null;
      const native = !!target?.closest(
        "header, [role=dialog], [data-cursor-native]",
      );
      setActive(inScene() && !native);
      const hot = target?.closest("[data-cursor-label]");
      setLabel(hot?.getAttribute("data-cursor-label") ?? DEFAULT_LABEL);
    };
    const onLeave = () => setActive(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(frame);
      root.removeAttribute("data-custom-cursor");
    };
  }, []);

  const size = label === DEFAULT_LABEL ? SIZE : SIZE_HOVER;

  return (
    <>
      <style>
        {
          "html[data-custom-cursor], html[data-custom-cursor] * { cursor: none !important; }"
        }
      </style>
      <div
        ref={ringRef}
        aria-hidden
        className={`pointer-events-none fixed left-0 top-0 z-[60] flex items-center justify-center rounded-full border border-white px-2 text-center text-[10px] font-bold uppercase leading-tight tracking-wide text-white transition-[opacity,width,height,margin,background-color] duration-300 ${
          shown ? "opacity-100" : "opacity-0"
        } ${
          // inverts against the page on white/black; a hard blur over photos
          label === DEFAULT_LABEL
            ? "mix-blend-difference"
            : "bg-black/25 backdrop-blur-xl"
        }`}
        style={{
          width: size,
          height: size,
          marginLeft: -size / 2,
          marginTop: -size / 2,
        }}
      >
        {label}
      </div>
    </>
  );
}
