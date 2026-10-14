"use client";

import { useRef } from "react";
import { rowPercent } from "@/config/grid";
import { EVENT_VIDEO_ON } from "@/config/timeline";
import { ASSETS } from "@/content/site";
import { useScrollProgress } from "@/hooks/useScrollProgress";

/**
 * The event video, filling the two top rows. It sits under the black panels
 * and stays hidden until they cover everything; the panels then sink away to
 * uncover it.
 */
export default function EventVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useScrollProgress((p) => {
    if (ref.current)
      ref.current.style.opacity = p >= EVENT_VIDEO_ON ? "1" : "0";
  });

  return (
    <video
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 w-full object-cover opacity-0"
      style={{ height: `${rowPercent(2)}%` }}
      src={ASSETS.eventVideo}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
    />
  );
}
