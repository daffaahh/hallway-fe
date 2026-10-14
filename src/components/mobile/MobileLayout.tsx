import MobileAbout from "./MobileAbout";
import MobileEvent from "./MobileEvent";
import MobileFooter from "./MobileFooter";
import MobileHeader from "./MobileHeader";
import MobileHero from "./MobileHero";
import MobileTenants from "./MobileTenants";

/**
 * The narrow-screen page: the same sections as the desktop stage, as plain
 * cards that follow each other (each rides up over the one before it). No
 * scroll-driven animation.
 */
export default function MobileLayout() {
  return (
    <>
      <MobileHeader />
      <MobileHero />
      <MobileAbout />
      <MobileTenants />
      <MobileEvent />
      <MobileFooter />
    </>
  );
}
