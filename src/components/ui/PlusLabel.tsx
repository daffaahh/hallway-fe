import type { ReactNode } from "react";

const plus =
  "inline-block transition-transform duration-300 group-hover:rotate-45";

/**
 * Label followed by "++". Put it inside an element with the `group` class and
 * both pluses rotate into a cross (x) when that element is hovered.
 */
export function PlusLabel({ children }: { children: ReactNode }) {
  return (
    <>
      {children}{" "}
      <span aria-hidden className={plus}>
        +
      </span>
      <span aria-hidden className={plus}>
        +
      </span>
    </>
  );
}
