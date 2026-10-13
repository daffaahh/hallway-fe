"use client";

import { Fragment, type CSSProperties, type ReactNode } from "react";
import { useTextLines } from "@/hooks/useTextLines";

/**
 * Clips its content so the inner `[data-reveal]` element can slide up from
 * behind the edge. Motion is driven by useRevealOnScroll on a parent.
 */
export function Reveal({
  as: Tag = "div",
  className = "",
  style,
  children,
}: {
  as?: "div" | "h2";
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <Tag className={`overflow-hidden ${className}`} style={style}>
      <div data-reveal style={{ transform: "translateY(105%)" }}>
        {children}
      </div>
    </Tag>
  );
}

/** A paragraph whose rendered lines each slide up on their own. */
export function RevealLines({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const { measureRef, lines } = useTextLines(text);

  return (
    <div className={className}>
      {/* invisible copy used to measure line breaks; also the accessible text */}
      <p ref={measureRef} className="invisible">
        {text.split(" ").map((word, i) => (
          <Fragment key={i}>
            {i > 0 && " "}
            <span>{word}</span>
          </Fragment>
        ))}
      </p>
      <div aria-hidden className="absolute inset-0">
        {lines.map((line, i) => (
          <Reveal key={i} className="whitespace-nowrap">
            {line}
          </Reveal>
        ))}
      </div>
    </div>
  );
}
