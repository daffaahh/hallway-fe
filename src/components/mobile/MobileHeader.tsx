"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import CollaborateSidebar from "@/components/collaborate/CollaborateSidebar";
import { PlusLabel } from "@/components/ui/PlusLabel";
import { SiteLink } from "@/components/ui/SiteLink";
import { ASSETS } from "@/content/site";

/**
 * Fixed top bar: logo (back to the top) and Collaborate. White with
 * `mix-blend-difference`, so it reads on both the light and the dark cards.
 */
export default function MobileHeader() {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-5 py-4 mix-blend-difference">
        <SiteLink
          target={{ section: "hero" }}
          label="The Hallway, back to the top"
        >
          <Image
            src={ASSETS.logoLight}
            alt="The Hallway"
            width={240}
            height={72}
            className="h-10 w-auto"
          />
        </SiteLink>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group text-sm font-bold uppercase tracking-wide text-white"
        >
          <PlusLabel>Collaborate</PlusLabel>
        </button>
      </header>

      <CollaborateSidebar open={open} onClose={close} />
    </>
  );
}
