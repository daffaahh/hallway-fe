import AboutSection from "@/components/about/AboutSection";
import GridTransition from "@/components/grid/GridTransition";
import HeroBackdrop from "@/components/hero/HeroBackdrop";
import HeroIntro from "@/components/hero/HeroIntro";
import Navbar from "@/components/navbar/Navbar";
import ScrollStage from "@/components/scroll/ScrollStage";
import { SNAP_START } from "@/config/timeline";

export default function Home() {
  return (
    <main>
      <ScrollStage snapFrom={SNAP_START}>
        <HeroBackdrop />
        <GridTransition />
        <Navbar />
        <AboutSection />
        <HeroIntro />
      </ScrollStage>
    </main>
  );
}
