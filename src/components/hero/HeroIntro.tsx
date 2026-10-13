"use client";

import Image from "next/image";
import { useRef } from "react";
import { ASSETS, HASHTAGS, TAGLINE } from "@/content/site";
import { FADE_END } from "@/config/timeline";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { segment } from "@/lib/scroll";

/** Centered logo, tagline and hashtags. Fades out as the user scrolls. */
export default function HeroIntro() {
  const ref = useRef<HTMLDivElement>(null);

  useScrollProgress((p) => {
    const el = ref.current;
    if (!el) return;
    const opacity = 1 - segment(p, 0, FADE_END);
    el.style.opacity = String(opacity);
    el.style.pointerEvents = opacity < 0.1 ? "none" : "";
  });

  return (
    <div
      ref={ref}
      className="absolute inset-0 flex items-center justify-center"
    >
      <div className="flex flex-col items-center gap-6 px-6 text-center">
        <Image
          src={ASSETS.logoLight}
          alt="The Hallway"
          width={320}
          height={96}
          className="w-48 md:w-80"
          style={{ height: "auto" }}
          priority
        />
        <h1 className="text-sm font-medium uppercase tracking-[0.35em] text-white md:text-xl">
          {TAGLINE}
        </h1>
        <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-white/80 md:text-base">
          {HASHTAGS.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      </div>

      <p className="absolute inset-x-0 bottom-8 text-center text-xs uppercase tracking-widest text-white/90 md:bottom-10 md:text-sm">
        Scroll Down
      </p>
    </div>
  );
}
