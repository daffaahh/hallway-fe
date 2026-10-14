import LazyVideo from "@/components/ui/LazyVideo";
import { ASSETS, EVENT_COPY, EVENT_TITLE } from "@/content/site";
import Card from "./Card";

/** Event card: the video, the title, the copy and the two buttons. */
export default function MobileEvent() {
  return (
    <Card id="event" className="bg-black text-white">
      <LazyVideo
        src={ASSETS.eventVideo}
        className="aspect-video w-full bg-neutral-900 object-cover"
      />

      <h2 className="mt-8 text-4xl font-medium uppercase tracking-[0.2em]">
        {EVENT_TITLE}
      </h2>
      <p className="mt-5 text-base font-medium leading-relaxed text-white/90">
        {EVENT_COPY.paragraph}
      </p>

      <div className="mt-8 flex flex-col gap-3">
        {EVENT_COPY.buttons.map((button) => (
          <a
            key={button.label}
            href={button.href}
            className="border border-white px-5 py-4 text-center text-xs font-bold uppercase tracking-[0.15em] transition-colors active:bg-white active:text-black"
          >
            {button.label}
          </a>
        ))}
      </div>
    </Card>
  );
}
