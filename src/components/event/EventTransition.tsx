import CoverPanels from "@/components/grid/CoverPanels";
import GridLines from "@/components/grid/GridLines";
import { ALL_CELLS } from "@/config/grid";
import {
  EVENT_COVER_DURATION,
  EVENT_COVER_START,
  EVENT_COVER_STEP,
  EVENT_LINES,
  EVENT_REFILL,
  EVENT_RELEASE,
} from "@/config/timeline";

/**
 * Tenants -> event: the grid rules draw in and stay, while black panels rise
 * over every cell, one column after another from the right like the hero
 * transition, each column filling from the bottom up. Later the panels of the
 * two top rows sink back down (see EventVideo), leaving the grid over the
 * video there and black only on the last row.
 */
export default function EventTransition() {
  return (
    <>
      <CoverPanels
        cells={ALL_CELLS}
        start={EVENT_COVER_START}
        step={EVENT_COVER_STEP}
        duration={EVENT_COVER_DURATION}
        fill="bg-black"
        origin="bottom"
        rise
        release={EVENT_RELEASE}
        refill={EVENT_REFILL}
      />
      <GridLines timing={EVENT_LINES} />
    </>
  );
}
