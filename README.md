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
| `images/about.JPG` | Photo in the about section (`thehallway.webp` is no longer referenced) |
| `images/tenants/1.JPG`, `2.JPG`, `3.JPG` | Tenant photos, left to right: 2 = Hobbies, 1 = FnB, 3 = Fashion. Sub photos live in `images/tenants/sub-tenant/` (the old `.png` versions are gone) |

## Structure

```
src/
├── app/                        Next.js routes (page.tsx only composes sections)
├── components/
│   ├── scroll/ScrollStage.tsx  Sticky scroll stage; publishes scroll progress
│   ├── scroll/SmoothScroll.tsx Eases mouse-wheel scrolling (no dependency)
│   ├── hero/                   HeroBackdrop (video + overlay), HeroIntro (logo, tagline)
│   ├── grid/                   GridTransition = CoverPanels + ImageReveal + GridLines
│   ├── navbar/Navbar.tsx       Fixed navbar (white + mix-blend-difference), "Collaborate ++" trigger
│   ├── tenants/                TenantsScene (black cells, title), TenantCard (photo + label + overlay), TenantPanel (Learn More + tenant list), TenantsCursor
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
<ScrollStage snapFrom={SNAP_START} snapTo={ABOUT_END}>
  <HeroBackdrop />
  <GridTransition />
  <Navbar />
  <AboutSection />
  <TenantsScene />
  <HeroIntro />
</ScrollStage>
```

Each section is independent: it only knows its own markup and reads scroll progress through `useScrollProgress`. Sections can be added, removed or reordered without touching the others. Copy lives in `content/site.ts`, layout in `config/grid.ts`, and timing in `config/timeline.ts`.

## How the scroll animation works

`ScrollStage` renders a tall wrapper (`SCROLL_LENGTH`, derived from the phase lengths) with a `sticky` full-screen section. A single `requestAnimationFrame`-throttled scroll listener turns the scroll position into a progress value `p` (0 → 1) and notifies subscribers. Components write transforms and opacity straight to their refs, so nothing re-renders while scrolling.

Timeline (fractions of the scroll distance, defined in `config/timeline.ts`):

| Phase | What happens |
| --- | --- |
| Intro → about, 0–25% | Logo, tagline, hashtags and "Scroll Down" fade out (`HeroIntro`) |
| 3–40% | Grid lines start drawing while the intro is still fading out: 4 verticals rise from the bottom, then one horizontal from the right and one from the left (`GridLines`) |
| 35–67% | White panels cover the cells column by column, right to left, each column starting just after the one before it; the first three cells of the middle row (row 2, columns 1–3) stay open (`CoverPanels`) |
| 70–100% | Lines retract toward the side they came from; the photo slides up into those three cells (`ImageReveal`); title, paragraph (line by line), "Learn More" and opening hours slide up from behind their masks (`AboutSection`); the navbar slides in (`Navbar`) |
| Hold | About stays put for `HOLD_VH` of scrolling before anything leaves |
| Exit | The about text slides back down behind its masks, and the photo is wiped away in one continuous sweep from its right edge to its left, leaving white behind (not the video). The navbar is `fixed` and stays |
| Tenants (`TENANTS_VH`) | Grid cells (col, row): (1,1) and (5,3) fade to black one after the other; photos slide up in (2,2) Hobbies, (4,3) FnB and (5,2) Fashion, left to right (`TenantCard`); each label sits above its photo, outside it (Hobbies at the photo's right edge, FnB and Fashion at the left edge, set by `labelSide` in `content/site.ts`), and slides up from behind a mask; "Tenants" rises in the bottom-left corner (`TenantsScene`). The navbar keeps working: its white + `mix-blend-difference` colors flip to white over the black cell |

Intro → about percentages are fractions of that phase only (`at(...)` in `config/timeline.ts`). The phase lengths are set in viewport heights: `INTRO_VH`, `HOLD_VH` and `EXIT_VH`; the stage length and all progress values are derived from them.

### Tenant categories

Clicking a tenant photo (Hobbies, FnB or Fashion) opens that category. The clicked photo stays; the other two cells get the category's two sub photos (`subPhotos` in `content/site.ts`, files in `public/images/tenants/sub-tenant/`) sliding up over them. The three photos are relabelled **Tenant 1–3** (left to right), a list of those names slides up next to the bottom-left title (`TenantPanel`), above a **Learn More ++** link that is always there (same style and + → × hover as in the about section; it stays clickable while a category is open) and the cursor reads **"Close"** everywhere. A click anywhere (an invisible full-scene button) or `Esc` slides the sub photos back down, so the user can pick another category. The navbar stays usable while a category is open. Scrolling back out of the scene also resets it. All three categories work the same way.

Every photo carries the tenant it shows (`name` in `content/site.ts`); once a category is open that name is the photo's label, so labels always follow their photo. `tenants` is the order the list shows them. Hobbies: Pensil dan Kertas (`2.JPG`), Shadow Goods (`hobbies-1.JPG`), The Throne Room (`hobbies-2.JPG`). Fashion: Wearbobe (`3.JPG`), Lil public (`fashion-1.JPG`), eternalworks (`fashion-2.JPG`). FnB: Gelora Fantasi (`1.JPG`), Kedai Jaya Bersama (`FnB-1.jpeg`), Rameninpo (`FnB-2.jpeg`). Source photos with transparent side bars need `zoom` to crop them (a bar of 12.5% per side → `zoom: 1.34`). File names are case-sensitive on Linux hosts (`2.JPG`, `hobbies-1.JPG`).

### Tenants cursor

`TenantsCursor` swaps the mouse cursor for a hollow circle (white + `mix-blend-difference`, so it reads on white, black and photos) once the tenants scene starts (`BLACK_START`). It reads "Click one" and changes to the label of the element under it: anything with a `data-cursor-label` attribute, e.g. a tenant photo and its label ("Learn more"; "Close" while a category is open). The native cursor comes back over the navbar, the collaborate dialog and anything marked `data-cursor-native` (the Learn More ++ link, whose + → × hover then plays as usual), and the effect is off on touch devices (`(pointer: fine)` only).

### Smooth scrolling

`SmoothScroll` (mounted in `page.tsx`) turns wheel input into a target position and eases the page toward it (`SMOOTHING_MS`, default 120; higher = floatier). Touch, keyboard and scrollbar dragging stay native, and it steps aside when the collaborate sidebar locks the page, inside scrollable elements, on pinch-zoom, and with `prefers-reduced-motion`.

### Snap (currently disabled)

Snap is switched off in `page.tsx` (see the comment there for how to re-enable it); the code in `ScrollStage` is intact. Behaviour when enabled:

`<ScrollStage snapFrom={SNAP_START} snapTo={ABOUT_END}>` enables a soft snap that kicks in ~150ms after the user stops scrolling. `SNAP_START` is the midpoint of the line-drawing phase (grid half drawn) and `ABOUT_END` is the point where the about section is fully revealed:

| Released at | Scrolling down | Scrolling up |
| --- | --- | --- |
| before `SNAP_START` | back to the hero | back to the hero |
| between `SNAP_START` and `ABOUT_END` | glides to the fully revealed about section | back to the hero |
| during the exit (past `ABOUT_END`) | completes the exit | back to the about section |

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
