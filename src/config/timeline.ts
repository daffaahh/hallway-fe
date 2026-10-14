import { LINES } from "./grid";

// The stage is a tall scroll area; all values below are fractions (0..1) of the
// scroll distance through it. Phases are laid out in viewport heights (vh) of
// scrolling so they can be tuned independently:
//   intro -> about | hold on about | exit | tenants
const INTRO_VH = 221;
const HOLD_VH = 40;
const EXIT_VH = 54;
const TENANTS_VH = 90;
const TOTAL_VH = INTRO_VH + HOLD_VH + EXIT_VH + TENANTS_VH;

export const SCROLL_LENGTH = `${TOTAL_VH + 100}vh`;

/** Progress at which the about section is fully revealed. */
export const ABOUT_END = INTRO_VH / TOTAL_VH;
/** Progress at which the exit starts (about stays put in between). */
export const EXIT_START = (INTRO_VH + HOLD_VH) / TOTAL_VH;

// Intro -> about: written as fractions of that phase, scaled into the stage
const at = (fraction: number) => fraction * ABOUT_END;

// Hero intro fades out
export const FADE_END = at(0.25);

// Grid lines draw in one after another, starting while the intro still fades
export const DRAW_START = at(0.03);
export const DRAW_END = at(0.4);
export const DRAW_DURATION = at(0.13);
export const DRAW_STEP =
  (DRAW_END - DRAW_START - DRAW_DURATION) / (LINES.length - 1);

// Scroll snap kicks in once the grid is half drawn
export const SNAP_START = (DRAW_START + DRAW_END) / 2;

// White panels cover the cells column by column, right to left
export const COVER_START = at(0.35);
export const COVER_STEP = at(0.022);
export const COVER_DURATION = at(0.16);

// Lines retract in reverse order
export const RETRACT_START = at(0.7);
export const RETRACT_DURATION = at(0.08);
export const RETRACT_STEP =
  (ABOUT_END - RETRACT_START - RETRACT_DURATION) / (LINES.length - 1);

// Photo, navbar and about text come in while the lines retract
export const REVEAL_START = RETRACT_START;
export const IMAGE_DURATION = at(0.2);
export const TEXT_DURATION = at(0.15);
export const TEXT_STEP = at(0.004);

// Exit into the next section: about text slides back down behind its masks and
// the photo is wiped away in one sweep from right to left. The navbar stays.
// Written as fractions of the exit phase.
const exit = (fraction: number) => (fraction * EXIT_VH) / TOTAL_VH;
export const TEXT_EXIT_DURATION = exit(0.55);
export const TEXT_EXIT_STEP = exit(0.018);
export const IMAGE_EXIT_DURATION = exit(0.7);

// Tenants scene, written as fractions of its phase. It starts once the exit is
// done: two cells fade to black, three photos slide up one after another, then
// the title rises in the bottom-right corner.
const TENANTS_START = (INTRO_VH + HOLD_VH + EXIT_VH) / TOTAL_VH;
const tenantsAt = (fraction: number) =>
  TENANTS_START + (fraction * TENANTS_VH) / TOTAL_VH;
const tenantsFor = (fraction: number) => (fraction * TENANTS_VH) / TOTAL_VH;

export const BLACK_START = tenantsAt(0);
export const BLACK_STEP = tenantsFor(0.12);
export const BLACK_DURATION = tenantsFor(0.4);

export const PHOTO_START = tenantsAt(0.2);
export const PHOTO_STEP = tenantsFor(0.18);
export const PHOTO_DURATION = tenantsFor(0.4);

export const TITLE_START = tenantsAt(0.55);
export const TITLE_DURATION = tenantsFor(0.4);
