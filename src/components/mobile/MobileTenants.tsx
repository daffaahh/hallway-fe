"use client";

import Image from "next/image";
import { useState } from "react";
import {
  TENANTS_CTA,
  TENANTS_TITLE,
  TENANT_CARDS,
  type TenantPhoto,
} from "@/content/site";
import Card from "./Card";

function Photo({
  photo,
  className,
}: {
  photo: TenantPhoto;
  className: string;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={photo.src}
        alt={photo.name}
        fill
        sizes="(max-width: 767px) 50vw, 100vw"
        className="object-cover"
        style={{ transform: `scale(${photo.zoom})` }}
      />
    </div>
  );
}

/**
 * Tenants card: one photo per category. Tapping a category lists its tenants
 * (the other two photos) right below it; tapping again closes it.
 */
export default function MobileTenants() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <Card id="tenants" className="bg-neutral-100 text-neutral-900">
      <h2 className="text-4xl font-medium uppercase tracking-[0.2em]">
        {TENANTS_TITLE}
      </h2>

      <ul className="mt-8 flex flex-col gap-10">
        {TENANT_CARDS.map((card) => {
          const isOpen = open === card.label;
          return (
            <li key={card.label}>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : card.label)}
                className="block w-full text-left"
              >
                <span className="mb-3 flex items-center justify-between text-lg font-bold uppercase tracking-wide">
                  {card.label}
                  <span aria-hidden>{isOpen ? "−" : "+"}</span>
                </span>
                <Photo photo={card} className="aspect-[4/3]" />
              </button>

              {isOpen && (
                <div className="mt-4">
                  <p className="mb-3 text-sm font-bold uppercase tracking-wide">
                    {card.name}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {card.subPhotos.map((photo) => (
                      <figure key={photo.src}>
                        <Photo photo={photo} className="aspect-[4/5]" />
                        <figcaption className="mt-2 text-sm font-bold uppercase tracking-wide">
                          {photo.name}
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <div className="mt-14">
        <p className="text-2xl font-bold leading-tight">
          {TENANTS_CTA.lines[0]}
        </p>
        <p className="text-2xl font-medium leading-tight">
          {TENANTS_CTA.lines[1]}
        </p>
        <a
          href="#"
          className="mt-6 inline-block border border-neutral-900 px-10 py-3 text-sm font-bold uppercase tracking-[0.2em] transition-colors active:bg-neutral-900 active:text-white"
        >
          {TENANTS_CTA.button}
        </a>
      </div>
    </Card>
  );
}
