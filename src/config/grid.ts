import type { CSSProperties } from "react";

// Rule-of-thirds style grid: 5 columns x 3 rows.
export const COLS = 5;
export const ROWS = 3;

export type Cell = { col: number; row: number };

/** Left edge of a column as a CSS percentage. */
export const colPercent = (col: number) => (col * 100) / COLS;
/** Top edge of a row as a CSS percentage. */
export const rowPercent = (row: number) => (row * 100) / ROWS;

/** Absolute position of a cell; `bleed` (e.g. " + 1px") hides seams between cells. */
export function cellStyle(cell: Cell, bleed = ""): CSSProperties {
  return {
    left: `${colPercent(cell.col)}%`,
    top: `${rowPercent(cell.row)}%`,
    width: `calc(${100 / COLS}%${bleed})`,
    height: `calc(${100 / ROWS}%${bleed})`,
  };
}

/** Absolute position of a rectangular block of cells. */
export function blockStyle(
  block: typeof IMAGE_BLOCK,
  bleed = "",
): CSSProperties {
  return {
    left: `${colPercent(block.col)}%`,
    top: `${rowPercent(block.row)}%`,
    width: `calc(${(block.cols * 100) / COLS}%${bleed})`,
    height: `calc(${(block.rows * 100) / ROWS}%${bleed})`,
  };
}

// Verticals draw upward from the bottom, the first horizontal draws in from
// the right and the second from the left. They retract back the way they came.
export const LINES = [
  { axis: "v", pos: colPercent(1), origin: "bottom" },
  { axis: "v", pos: colPercent(2), origin: "bottom" },
  { axis: "v", pos: colPercent(3), origin: "bottom" },
  { axis: "v", pos: colPercent(4), origin: "bottom" },
  { axis: "h", pos: rowPercent(1), origin: "right" },
  { axis: "h", pos: rowPercent(2), origin: "left" },
] as const;

/**
 * Cells that stay open and later reveal the photo: the first three cells of
 * the middle row, i.e. row 2, columns 1-3 (zero-based: row 1, cols 0-2).
 */
export const IMAGE_BLOCK = { col: 0, row: 1, cols: 3, rows: 1 };

export const ALL_CELLS: Cell[] = Array.from(
  { length: COLS * ROWS },
  (_, i) => ({
    col: i % COLS,
    row: Math.floor(i / COLS),
  }),
);

const inImageBlock = (c: Cell) =>
  c.col >= IMAGE_BLOCK.col &&
  c.col < IMAGE_BLOCK.col + IMAGE_BLOCK.cols &&
  c.row >= IMAGE_BLOCK.row &&
  c.row < IMAGE_BLOCK.row + IMAGE_BLOCK.rows;

// Tenants scene (zero-based; the user's "col 2 row 2" is { col: 1, row: 1 }).
// Cells that fade to black: top-left and bottom-right.
export const TENANT_BLACK_CELLS: Cell[] = [
  { col: 0, row: 0 },
  { col: 4, row: 2 },
];
// Cells that slide up a photo, left to right (matches TENANT_CARDS order).
export const TENANT_PHOTO_CELLS: Cell[] = [
  { col: 1, row: 1 },
  { col: 3, row: 2 },
  { col: 4, row: 1 },
];

// Footer scene (zero-based): cells that fade to white and hold dark links.
export const FOOTER_WHITE_CELLS: Cell[] = [
  { col: 0, row: 1 }, // page links
  { col: 3, row: 1 }, // "Come Find Us"
  { col: 1, row: 2 }, // social links
];

export const COVER_CELLS = ALL_CELLS.filter((c) => !inImageBlock(c));
