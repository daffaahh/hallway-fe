import { COVER_CELLS } from "@/config/grid";
import {
  COVER_DURATION,
  COVER_START,
  COVER_STEP,
  HERO_LINES,
} from "@/config/timeline";
import { ASSETS } from "@/content/site";
import CoverPanels from "./CoverPanels";
import GridLines from "./GridLines";
import ImageReveal from "./ImageReveal";

/** Hero -> about: cover panels, photo cells and rules, back to front. */
export default function GridTransition() {
  return (
    <>
      <CoverPanels
        cells={COVER_CELLS}
        start={COVER_START}
        step={COVER_STEP}
        duration={COVER_DURATION}
        fill="bg-white"
        origin="top"
      />
      <ImageReveal src={ASSETS.photo} />
      <GridLines timing={HERO_LINES} />
    </>
  );
}
