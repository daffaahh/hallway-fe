"use client";

import type { ReactNode } from "react";
import type { LinkTarget } from "@/content/site";
import { useGoToSection, useHasScrollStage } from "@/hooks/useGoToSection";

/**
 * A link to a section of the page (glides there) or out to another site (opens
 * in a new tab). Without the scroll stage (mobile) a section link scrolls to the
 * element with that id.
 */
export function SiteLink({
  target,
  className,
  label,
  children,
}: {
  target: LinkTarget;
  className?: string;
  /** accessible name, for links that only hold an image */
  label?: string;
  children: ReactNode;
}) {
  const goTo = useGoToSection();
  const hasStage = useHasScrollStage();

  if ("section" in target) {
    return (
      <a
        href={`#${target.section}`}
        className={className}
        aria-label={label}
        onClick={(e) => {
          e.preventDefault();
          if (hasStage) goTo(target.section);
          else {
            document
              .getElementById(target.section)
              ?.scrollIntoView({ behavior: "smooth" });
          }
        }}
      >
        {children}
      </a>
    );
  }

  return (
    <a
      href={target.href}
      className={className}
      aria-label={label}
      {...(target.external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      {children}
    </a>
  );
}
