import { ASSETS } from "@/content/site";
import CoverPanels from "./CoverPanels";
import GridLines from "./GridLines";
import ImageReveal from "./ImageReveal";

/** The scroll-driven grid: cover panels, photo cells and rules, back to front. */
export default function GridTransition() {
  return (
    <>
      <CoverPanels />
      <ImageReveal src={ASSETS.photo} />
      <GridLines />
    </>
  );
}
