"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A muted looping video that only starts downloading once it is about to
 * scroll into view, so heavy clips cost nothing until they are needed.
 */
export default function LazyVideo({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      aria-hidden
      className={className}
      src={near ? src : undefined}
      autoPlay
      muted
      loop
      playsInline
      preload="none"
    />
  );
}
