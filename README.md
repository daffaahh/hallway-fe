# The Hallway — Frontend

Landing page for **The Hallway Space**, a creative space on the 2nd floor of Pasar Kosambi, Bandung. Built with Next.js (App Router), React and Tailwind CSS v4.

> This project uses a newer Next.js than most training data covers. See `AGENTS.md` and read `node_modules/next/dist/docs/` before changing framework-level code.

## Getting started

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint
```

## Assets

All files live in `public/`:

| Path | Use |
| --- | --- |
| `videos/background.mp4` | Hero background video |
| `images/logo-white.png` | Logo in the hero (over the video) |
| `images/logo.png` | Logo in the navbar (over the white page) |
| `images/thehallway.webp` | Photo revealed in the final state |

## Structure

```
src/
├── app/                        Next.js routes (page.tsx only composes sections)
├── components/
│   ├── scroll/ScrollStage.tsx  Sticky scroll stage; publishes scroll progress
│   ├── hero/                   HeroBackdrop (video + overlay), HeroIntro (logo, tagline)
│   ├── grid/                   GridTransition = CoverPanels + ImageReveal + GridLines
│   ├── navbar/Navbar.tsx       Logo, links, "Collaborate ++" trigger
│   ├── about/AboutSection.tsx  Title, paragraph, "Learn More ++"
│   ├── collaborate/            Slide-in "Let's Collaborate" form
│   └── ui/Reveal.tsx           Slide-up text masks (Reveal, RevealLines)
├── hooks/
│   ├── useScrollProgress.ts    Subscribe to stage progress (0..1) without re-rendering
│   ├── useRevealOnScroll.ts    Slide-up every [data-reveal] inside a ref
│   └── useTextLines.ts         Detect where a paragraph wraps
├── config/
│   ├── grid.ts                 Grid size, line definitions, which cells show the photo
│   └── timeline.ts             When each animation starts/ends along the scroll
├── content/site.ts             Copy, nav items, asset paths
└── lib/                        scroll.ts (clamp, easing, segment), styles.ts (shared classes)
```

`page.tsx` is the whole composition:

```tsx
<ScrollStage>
  <HeroBackdrop />
  <GridTransition />
  <Navbar />
  <AboutSection />
  <HeroIntro />
</ScrollStage>
```

Each section is independent: it only knows its own markup and reads scroll progress through `useScrollProgress`. Sections can be added, removed or reordered without touching the others. Copy lives in `content/site.ts`, layout in `config/grid.ts`, and timing in `config/timeline.ts`.

## How the scroll animation works

`ScrollStage` renders a tall wrapper (`SCROLL_LENGTH`, 320vh) with a `sticky` full-screen section. A single `requestAnimationFrame`-throttled scroll listener turns the scroll position into a progress value `p` (0 → 1) and notifies subscribers. Components write transforms and opacity straight to their refs, so nothing re-renders while scrolling.

Timeline (fractions of the scroll distance, defined in `config/timeline.ts`):

| Progress | What happens |
| --- | --- |
| 0 – 0.25 | Logo, tagline, hashtags and "Scroll Down" fade out (`HeroIntro`) |
| 0.03 – 0.4 | Grid lines start drawing while the intro is still fading out: 4 verticals rise from the bottom, then one horizontal from the right and one from the left (`GridLines`) |
| 0.35 – 0.67 | White panels cover the cells column by column, right to left; the two left cells of the middle row stay open (`CoverPanels`) |
| 0.7 – 1 | Lines retract toward the side they came from; the photo slides up into the open cells (`ImageReveal`); navbar, title, paragraph (line by line) and "Learn More" slide up from behind their masks (`Navbar`, `AboutSection`) |

### Snap into the about section

`<ScrollStage snapFrom={SNAP_START}>` enables a soft snap that kicks in ~150ms after the user stops scrolling. `SNAP_START` is the midpoint of the line-drawing phase (grid half drawn):

- released scrolling **down** past `SNAP_START` → glides to the end so the about section is fully revealed
- anything else (released before `SNAP_START`, or while scrolling **up**) → glides back to the hero (progress 0)

The glide speed is set with `snapDuration` (milliseconds, default 3570; higher = slower). It runs on a custom animation because the browser's built-in smooth scroll has a fixed speed, and any wheel, touch or key input cancels it. Omit `snapFrom` to disable.

### Adding a new animated piece

```tsx
"use client";
function MyThing() {
  const ref = useRef<HTMLDivElement>(null);
  useScrollProgress((p) => {
    if (ref.current) ref.current.style.opacity = String(segment(p, 0.3, 0.2));
  });
  return <div ref={ref} />;
}
```

For slide-up text, wrap content in `<Reveal>` and call `useRevealOnScroll(containerRef, REVEAL_START)` on a parent.

### Text reveal

`Reveal` wraps content in an `overflow-hidden` box and exposes an inner `[data-reveal]` element; `useRevealOnScroll` slides each one from `translateY(105%)` to `0` in DOM order with a small stagger. `RevealLines` measures an invisible copy of the paragraph (`useTextLines`) to find where lines wrap, re-measures on resize, and renders each line in its own `Reveal`.

## Collaborate sidebar

"Collaborate ++" in the navbar opens a right-hand panel (40% wide on desktop, full width on mobile) over a dark backdrop. It closes with the X button, a click on the backdrop, or `Esc`, and locks page scroll while open.

The form currently only validates required fields and closes — **no submission target is wired up yet**. Add a server action or API route in `components/collaborate/CollaborateSidebar.tsx`'s `onSubmit` to send the data somewhere.

## TODO

- Real links for Tenants, Event, Visit and Learn More (currently `href="#"`)
- Submit handler for the collaborate form
- Mobile layout pass (navbar and paragraph are sized for desktop first)
