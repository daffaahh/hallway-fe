import Image from "next/image";
import { ASSETS, HASHTAGS, TAGLINE } from "@/content/site";

/** Full-screen video with the logo, tagline and hashtags. */
export default function MobileHero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-svh items-center justify-center overflow-hidden pb-8"
    >
      <video
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
        src={ASSETS.video}
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative flex flex-col items-center gap-5 px-6 text-center">
        <Image
          src={ASSETS.logoLight}
          alt="The Hallway"
          width={320}
          height={96}
          className="w-44"
          style={{ height: "auto" }}
          priority
        />
        <h1 className="text-xs font-medium uppercase tracking-[0.3em] text-white">
          {TAGLINE}
        </h1>
        <ul className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-white/80">
          {HASHTAGS.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      </div>

      <p className="absolute inset-x-0 bottom-14 text-center text-[10px] uppercase tracking-widest text-white/90">
        Scroll Down
      </p>
    </section>
  );
}
