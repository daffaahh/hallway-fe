"use client";

import { useIsDesktop } from "@/hooks/useIsDesktop";
import DesktopExperience from "./desktop/DesktopExperience";
import MobileLayout from "./mobile/MobileLayout";

/**
 * Picks the experience for the screen: the scroll-driven stage on wide
 * screens, a plain stack of cards on narrow ones (no scroll animation).
 */
export default function Experience() {
  const isDesktop = useIsDesktop();
  return isDesktop ? <DesktopExperience /> : <MobileLayout />;
}
