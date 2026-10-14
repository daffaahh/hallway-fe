import type { ReactNode } from "react";

/**
 * One section of the mobile page: a card with rounded top corners that rides
 * up over the bottom of the one before it.
 */
export default function Card({
  id,
  className = "",
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={`relative -mt-8 scroll-mt-0 rounded-t-[2rem] px-6 pb-16 pt-12 ${className}`}
    >
      {children}
    </section>
  );
}
