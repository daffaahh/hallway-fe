"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import CollaborateSidebar from "@/components/collaborate/CollaborateSidebar";
import { PlusLabel } from "@/components/ui/PlusLabel";
import { Reveal } from "@/components/ui/Reveal";
import { colPercent } from "@/config/grid";
import { IMAGE_DURATION, REVEAL_START } from "@/config/timeline";
import { ASSETS, NAV_ITEMS } from "@/content/site";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { LINK_HOVER } from "@/lib/styles";

const linkText =
  "text-sm font-bold uppercase tracking-wide text-white md:text-xl";

/**
 * Logo, page links and the collaborate trigger. Slides in at the end.
 * Everything is white with `mix-blend-difference`, so it reads as black on the
 * white page and flips to white over the black cells of the tenants scene.
 */
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
        className="fixed inset-x-0 top-0 z-40 flex mix-blend-difference items-start justify-between gap-4 px-6 py-6 md:px-12 md:py-8"
      >
        <Reveal>
          <Image
            src={ASSETS.logoLight}
            alt="The Hallway"
            width={240}
            height={72}
            className="h-12 w-auto md:h-16"
          />
        </Reveal>

        <nav
          className={`absolute flex flex-col gap-3 ${linkText}`}
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
            className={`group ${linkText}`}
          >
            <PlusLabel>Collaborate</PlusLabel>
          </button>
        </Reveal>
      </header>

      <CollaborateSidebar open={collabOpen} onClose={closeCollab} />
    </>
  );
}
