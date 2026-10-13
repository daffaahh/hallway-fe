"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import CollaborateSidebar from "@/components/collaborate/CollaborateSidebar";
import { Reveal } from "@/components/ui/Reveal";
import { colPercent } from "@/config/grid";
import { IMAGE_DURATION, REVEAL_START } from "@/config/timeline";
import { ASSETS, NAV_ITEMS } from "@/content/site";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { LINK_HOVER } from "@/lib/styles";

const linkText =
  "text-xs font-bold uppercase tracking-wide text-neutral-900 md:text-base";

/** Logo, page links and the collaborate trigger. Slides in at the end. */
export default function Navbar() {
  const ref = useRef<HTMLElement>(null);
  const [collabOpen, setCollabOpen] = useState(false);
  const closeCollab = useCallback(() => setCollabOpen(false), []);

  useRevealOnScroll(ref, REVEAL_START);

  // not clickable until it has slid in
  useScrollProgress((p) => {
    if (ref.current) {
      ref.current.style.pointerEvents =
        p < REVEAL_START + IMAGE_DURATION / 2 ? "none" : "";
    }
  });

  return (
    <>
      <header
        ref={ref}
        className="absolute inset-x-0 top-0 flex items-start justify-between gap-4 px-6 py-5 md:px-12"
      >
        <Reveal>
          <Image
            src={ASSETS.logoDark}
            alt="The Hallway"
            width={160}
            height={48}
            className="h-10 w-auto"
          />
        </Reveal>

        <nav
          className={`absolute flex flex-col gap-2 ${linkText}`}
          style={{ left: `${colPercent(3)}%` }}
        >
          {NAV_ITEMS.map((item) => (
            <Reveal key={item}>
              <a href="#" className={`block w-fit pb-1 ${LINK_HOVER}`}>
                {item}
              </a>
            </Reveal>
          ))}
        </nav>

        <Reveal>
          <button
            type="button"
            onClick={() => setCollabOpen(true)}
            className={`pb-1 ${linkText} ${LINK_HOVER}`}
          >
            Collaborate ++
          </button>
        </Reveal>
      </header>

      <CollaborateSidebar open={collabOpen} onClose={closeCollab} />
    </>
  );
}
