"use client";

import { useEffect, useRef } from "react";

const FIELDS = [
  { name: "firstName", label: "First name", type: "text" },
  { name: "lastName", label: "Last name", type: "text" },
  { name: "email", label: "Email address", type: "email" },
] as const;

const underline =
  "w-full border-0 border-b border-neutral-900/70 bg-transparent py-3 text-sm font-medium uppercase tracking-wide text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-900";

export default function CollaborateSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    firstFieldRef.current?.focus({ preventScroll: true });

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/70 transition-opacity duration-500 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Collaborate"
        className={`absolute inset-y-0 right-0 flex w-full flex-col bg-white px-6 py-6 text-neutral-900 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] md:w-[40%] md:px-10 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between">
          <h2 className="text-5xl font-extrabold uppercase leading-[0.9] tracking-tight md:text-7xl">
            Let&apos;s
            <br />
            Collaborate
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1"
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path
                d="M2 2l24 24M26 2L2 26"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </button>
        </div>

        <form
          className="mt-auto flex flex-1 flex-col justify-between pt-16"
          onSubmit={(e) => {
            e.preventDefault();
            onClose();
          }}
        >
          <div className="flex flex-col gap-4">
            {FIELDS.map((field, i) => (
              <input
                key={field.name}
                ref={i === 0 ? firstFieldRef : undefined}
                name={field.name}
                type={field.type}
                placeholder={field.label}
                required
                className={underline}
              />
            ))}
            <textarea
              name="message"
              placeholder="Brief description of your project*"
              required
              rows={3}
              className={`${underline} resize-none`}
            />
          </div>

          <button
            type="submit"
            className="self-start text-sm font-bold uppercase tracking-wide"
          >
            Submit ++
          </button>
        </form>
      </aside>
    </div>
  );
}
