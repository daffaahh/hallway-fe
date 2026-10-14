import Image from "next/image";
import { PlusLabel } from "@/components/ui/PlusLabel";
import {
  ABOUT_PARAGRAPHS,
  ABOUT_TITLE,
  ASSETS,
  OPEN_HOURS,
} from "@/content/site";
import Card from "./Card";

/** About card: title, photo, opening hours, intro and a call to action. */
export default function MobileAbout() {
  return (
    <Card id="about" className="bg-white text-neutral-900">
      <h2 className="text-3xl font-medium uppercase tracking-[0.2em]">
        {ABOUT_TITLE}
      </h2>

      <div className="relative mt-6 aspect-[16/10] overflow-hidden">
        <Image
          src={ASSETS.photo}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <p className="mt-3 text-right text-xs font-bold uppercase tracking-wide">
        {OPEN_HOURS}
      </p>

      <div className="mt-8 flex flex-col gap-5 text-base font-medium leading-relaxed text-neutral-800">
        {ABOUT_PARAGRAPHS.map((text) => (
          <p key={text}>{text}</p>
        ))}
      </div>

      <a
        href="#"
        className="group mt-8 block w-fit text-sm font-bold uppercase tracking-wide"
      >
        <PlusLabel>Learn More</PlusLabel>
      </a>
    </Card>
  );
}
