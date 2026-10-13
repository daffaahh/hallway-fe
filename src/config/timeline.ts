import { LINES } from "./grid";

// Everything below is a fraction (0..1) of the scroll stage's distance.
export const SCROLL_LENGTH = "320vh";

// Hero intro fades out
export const FADE_END = 0.25;

// Grid lines draw in one after another, starting while the intro still fades
export const DRAW_START = 0.03;
export const DRAW_END = 0.4;
export const DRAW_DURATION = 0.13;
export const DRAW_STEP =
  (DRAW_END - DRAW_START - DRAW_DURATION) / (LINES.length - 1);

// Scroll snap kicks in once the grid is half drawn
export const SNAP_START = (DRAW_START + DRAW_END) / 2;

// White panels cover the cells column by column, right to left
export const COVER_START = 0.35;
export const COVER_STEP = 0.04;
export const COVER_DURATION = 0.16;

// Lines retract in reverse order
export const RETRACT_START = 0.7;
export const RETRACT_DURATION = 0.08;
export const RETRACT_STEP =
  (1 - RETRACT_START - RETRACT_DURATION) / (LINES.length - 1);

// Photo, navbar and about text come in while the lines retract
export const REVEAL_START = RETRACT_START;
export const IMAGE_DURATION = 0.2;
export const TEXT_DURATION = 0.15;
export const TEXT_STEP = 0.004;
