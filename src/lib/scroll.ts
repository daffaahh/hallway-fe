export const clamp = (n: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, n));

export const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

export const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;

/** 0..1 progress of `p` through the window [start, start + duration]. */
export const segment = (p: number, start: number, duration: number) =>
  clamp((p - start) / duration);
