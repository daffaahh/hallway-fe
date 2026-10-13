"use client";

import { useLayoutEffect, useRef, useState } from "react";

/**
 * Finds where `text` wraps. Attach `measureRef` to a paragraph whose words are
 * each wrapped in a <span>; `lines` updates on resize.
 */
export function useTextLines(text: string) {
  const measureRef = useRef<HTMLParagraphElement>(null);
  const [lines, setLines] = useState<string[]>([]);

  useLayoutEffect(() => {
    const el = measureRef.current;
    if (!el) return;

    const measure = () => {
      const grouped: string[][] = [];
      let lastTop: number | null = null;
      el.querySelectorAll<HTMLElement>("span").forEach((word) => {
        if (lastTop === null || Math.abs(word.offsetTop - lastTop) > 2) {
          grouped.push([]);
          lastTop = word.offsetTop;
        }
        grouped[grouped.length - 1].push(word.textContent ?? "");
      });
      const next = grouped.map((words) => words.join(" "));
      setLines((prev) =>
        prev.length === next.length && prev.every((l, i) => l === next[i])
          ? prev
          : next,
      );
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [text]);

  return { measureRef, lines };
}
