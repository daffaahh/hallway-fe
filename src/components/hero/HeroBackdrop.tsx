import { ASSETS } from "@/content/site";

export default function HeroBackdrop() {
  return (
    <>
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={ASSETS.video}
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="absolute inset-0 bg-black/60" />
    </>
  );
}
