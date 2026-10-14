import { COLS, LINES } from "./grid";

/** When the grid rules draw in (and optionally retract), as scroll progress. */
export type LineTiming = {
  drawStart: number;
  drawStep: number;
  drawDuration: number;
  /** omit to keep the rules drawn once they are in */
  retract?: { start: number; step: number; duration: number };
};

// The stage is a tall scroll area; all values below are fractions (0..1) of the
// scroll distance through it. Phases are laid out in viewport heights (vh) of
// scrolling so they can be tuned independently:
//   intro -> about | hold | exit | tenants | hold | event transition | event | hold | footer transition
const INTRO_VH = 221;
const HOLD_VH = 40;
const EXIT_VH = 54;
const TENANTS_VH = 90;
const TENANTS_HOLD_VH = 40;
const EVENT_VH = 100;
const EVENT_SHOW_VH = 90;
const EVENT_HOLD_VH = 40;
const FOOTER_VH = 160;
const TOTAL_VH =
  INTRO_VH +
  HOLD_VH +
  EXIT_VH +
  TENANTS_VH +
  TENANTS_HOLD_VH +
  EVENT_VH +
  EVENT_SHOW_VH +
  EVENT_HOLD_VH +
  FOOTER_VH;

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

export const HERO_LINES: LineTiming = {
  drawStart: DRAW_START,
  drawStep: DRAW_STEP,
  drawDuration: DRAW_DURATION,
  retract: {
    start: RETRACT_START,
    step: RETRACT_STEP,
    duration: RETRACT_DURATION,
  },
};

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

export const CTA_START = tenantsAt(0.5);
export const CTA_DURATION = tenantsFor(0.35);

// Event transition (after the tenants scene has stayed put for a while), as
// fractions of its phase. The tenants elements slide away, the grid rules draw
// in (and stay), and black panels rise over the cells column by column, right
// to left like the hero transition, each column filling from the bottom up.
// What is left is a black screen with the grid for the event section.
const EVENT_START =
  (INTRO_VH + HOLD_VH + EXIT_VH + TENANTS_VH + TENANTS_HOLD_VH) / TOTAL_VH;
const eventAt = (fraction: number) =>
  EVENT_START + (fraction * EVENT_VH) / TOTAL_VH;
const eventFor = (fraction: number) => (fraction * EVENT_VH) / TOTAL_VH;

export const TENANT_EXIT_START = eventAt(0);
export const TENANT_TEXT_EXIT_DURATION = eventFor(0.25);
export const TENANT_TEXT_EXIT_STEP = eventFor(0.008);
export const TENANT_PHOTO_EXIT_DURATION = eventFor(0.25);
export const TENANT_PHOTO_EXIT_STEP = eventFor(0.05);

export const EVENT_LINES: LineTiming = {
  drawStart: eventAt(0.04),
  drawStep: eventFor(0.03),
  drawDuration: eventFor(0.15),
};

export const EVENT_COVER_START = eventAt(0.2);
export const EVENT_COVER_STEP = eventFor(0.08);
export const EVENT_COVER_DURATION = eventFor(0.45);

// Event section, as fractions of its phase. Once the black screen is complete
// the title, copy and buttons slide up from behind their masks, one after
// another. While they do, the black panels of the two top rows sink back down,
// column by column, uncovering the event video behind them.
const EVENT_SHOW_START =
  (INTRO_VH + HOLD_VH + EXIT_VH + TENANTS_VH + TENANTS_HOLD_VH + EVENT_VH) /
  TOTAL_VH;
const showAt = (fraction: number) =>
  EVENT_SHOW_START + (fraction * EVENT_SHOW_VH) / TOTAL_VH;
const showFor = (fraction: number) => (fraction * EVENT_SHOW_VH) / TOTAL_VH;

export const EVENT_SHOW_AT = showAt(0.05);
export const EVENT_SHOW_DURATION = showFor(0.3);
export const EVENT_SHOW_STEP = showFor(0.025);

/** The panels cover everything from here on, so the video may be switched on. */
export const EVENT_VIDEO_ON =
  EVENT_COVER_START + (COLS - 1) * EVENT_COVER_STEP + EVENT_COVER_DURATION;

export const EVENT_RELEASE = {
  start: showAt(0.12),
  step: showFor(0.05),
  duration: showFor(0.5),
  /** how many of the top rows are uncovered */
  rows: 2,
};

// Footer transition (after the event section has stayed put for a while), as
// fractions of its phase. The event copy and the navbar (except Collaborate)
// slide down, the black panels rise again over the two top rows (hiding the
// video), three cells fade to white, and the footer content slides up.
const FOOTER_START =
  (INTRO_VH +
    HOLD_VH +
    EXIT_VH +
    TENANTS_VH +
    TENANTS_HOLD_VH +
    EVENT_VH +
    EVENT_SHOW_VH +
    EVENT_HOLD_VH) /
  TOTAL_VH;
const footerAt = (fraction: number) =>
  FOOTER_START + (fraction * FOOTER_VH) / TOTAL_VH;
const footerFor = (fraction: number) => (fraction * FOOTER_VH) / TOTAL_VH;

export const EVENT_EXIT_START = footerAt(0);
export const EVENT_TEXT_EXIT_DURATION = footerFor(0.2);
export const EVENT_TEXT_EXIT_STEP = footerFor(0.01);

export const EVENT_REFILL = {
  start: footerAt(0.15),
  step: footerFor(0.07),
  duration: footerFor(0.3),
};

export const FOOTER_WHITE_START = footerAt(0.6);
export const FOOTER_WHITE_STEP = footerFor(0.08);
export const FOOTER_WHITE_DURATION = footerFor(0.2);

export const FOOTER_SHOW_AT = footerAt(0.76);
export const FOOTER_SHOW_DURATION = footerFor(0.12);
export const FOOTER_SHOW_STEP = footerFor(0.008);

// Scroll positions the links jump to: each section fully shown, in the middle
// of its hold.
export const SECTION_PROGRESS = {
  hero: 0,
  tenants:
    (INTRO_VH + HOLD_VH + EXIT_VH + TENANTS_VH + TENANTS_HOLD_VH / 2) /
    TOTAL_VH,
  event:
    (INTRO_VH +
      HOLD_VH +
      EXIT_VH +
      TENANTS_VH +
      TENANTS_HOLD_VH +
      EVENT_VH +
      EVENT_SHOW_VH +
      EVENT_HOLD_VH / 2) /
    TOTAL_VH,
} as const;

export type SectionKey = keyof typeof SECTION_PROGRESS;
