"use client";

import { createContext, useContext, useEffect, useRef } from "react";

export type ProgressListener = (progress: number) => void;
export type Subscribe = (listener: ProgressListener) => () => void;

export const ScrollStageContext = createContext<Subscribe | null>(null);

/**
 * Calls `onProgress` with the stage's scroll progress (0..1) on every scroll
 * frame, without re-rendering. Must be used inside <ScrollStage>.
 */
export function useScrollProgress(onProgress: ProgressListener) {
  const subscribe = useContext(ScrollStageContext);
  if (!subscribe) {
    throw new Error("useScrollProgress must be used inside <ScrollStage>");
  }

  const handlerRef = useRef(onProgress);
  useEffect(() => {
    handlerRef.current = onProgress;
  });

  useEffect(() => subscribe((p) => handlerRef.current(p)), [subscribe]);
}
