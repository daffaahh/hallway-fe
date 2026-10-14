"use client";

import { createContext, useCallback, useContext } from "react";
import { SECTION_PROGRESS, type SectionKey } from "@/config/timeline";

/** Provided by <ScrollStage>: glides the page to a scroll progress (0..1). */
export const ScrollControlContext = createContext<
  ((progress: number) => void) | null
>(null);

/** Returns a function that glides to one of the stage's sections. */
export function useGoToSection() {
  const scrollToProgress = useContext(ScrollControlContext);
  return useCallback(
    (section: SectionKey) => scrollToProgress?.(SECTION_PROGRESS[section]),
    [scrollToProgress],
  );
}
