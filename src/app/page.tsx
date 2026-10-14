import AboutSection from "@/components/about/AboutSection";
import GridTransition from "@/components/grid/GridTransition";
import HeroBackdrop from "@/components/hero/HeroBackdrop";
import HeroIntro from "@/components/hero/HeroIntro";
import Navbar from "@/components/navbar/Navbar";
import ScrollStage from "@/components/scroll/ScrollStage";
import SmoothScroll from "@/components/scroll/SmoothScroll";
import TenantsCursor from "@/components/tenants/TenantsCursor";
import TenantsScene from "@/components/tenants/TenantsScene";

export default function Home() {
  return (
    <main>
      <SmoothScroll />
      {/* Scroll snap is switched off for now. To bring it back, import
          ABOUT_END and SNAP_START from "@/config/timeline" and use
          <ScrollStage snapFrom={SNAP_START} snapTo={ABOUT_END}>. */}
      <ScrollStage>
        <HeroBackdrop />
        <GridTransition />
        <Navbar />
        <AboutSection />
        <TenantsScene />
        <TenantsCursor />
        <HeroIntro />
      </ScrollStage>
    </main>
  );
}
