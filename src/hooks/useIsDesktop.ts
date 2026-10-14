"use client";

import { useSyncExternalStore } from "react";

/** Width from which the scroll-driven desktop experience is used. */
const DESKTOP_QUERY = "(min-width: 768px)";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(DESKTOP_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

/**
 * Whether the viewport is wide enough for the desktop experience. The server
 * (and the first hydration pass) assume mobile, which is the lighter tree.
 */
export function useIsDesktop() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => false,
  );
}
