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
| `videos/event.mp4` | Event section video (top two rows) |
| `images/logo-white.png` | Logo in the hero (over the video) |
| `images/logo.png` | Logo in the navbar (over the white page) |
| `images/about.JPG` | Photo in the about section (`thehallway.webp` is no longer referenced) |
| `images/tenants/1.JPG`, `2.JPG`, `3.JPG` | Tenant photos, left to right: 2 = Hobbies, 1 = FnB, 3 = Fashion. Sub photos live in `images/tenants/sub-tenant/` (the old `.png` versions are gone) |

## Structure

```
src/
├── app/                        Next.js routes (page.tsx only composes sections)
├── components/
│   ├── Experience.tsx          Picks desktop (scroll stage) or mobile (cards) by screen width
│   ├── desktop/DesktopExperience.tsx  The sticky scroll stage, composed
│   ├── mobile/                 Plain card layout for narrow screens (no scroll animation)
│   ├── scroll/ScrollStage.tsx  Sticky scroll stage; publishes scroll progress
│   ├── scroll/SmoothScroll.tsx Eases mouse-wheel scrolling (no dependency)
│   ├── hero/                   HeroBackdrop (video + overlay), HeroIntro (logo, tagline)
│   ├── grid/                   GridTransition = CoverPanels + ImageReveal + GridLines
│   ├── navbar/Navbar.tsx       Fixed navbar (white + mix-blend-difference), "Collaborate ++" trigger
│   ├── footer/FooterSection.tsx Footer laid out cell by cell on the grid
│   ├── event/EventSection.tsx  Event title, copy + buttons on the last grid row
│   ├── event/EventVideo.tsx    Event video under the black panels (top two rows)
│   ├── event/EventTransition.tsx Tenants → event: grid rules + black panels rising column by column
│   ├── tenants/                TenantsScene (black cells, title), TenantCard (photo + label + overlay), TenantPanel (Learn More + tenant list), TenantsCta (copy + Join button), TenantsCursor
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

`page.tsx` renders `<Experience />`, which picks one of two trees with `useIsDesktop` (viewport ≥ 768px; the server and first paint assume mobile). The desktop tree (`DesktopExperience`) is:

```tsx
<ScrollStage snapFrom={SNAP_START} snapTo={ABOUT_END}>
  <HeroBackdrop />
  <GridTransition />
  <Navbar />
  <AboutSection />
  <TenantsScene />
  <EventVideo />
  <EventTransition />
  <EventSection />
  <FooterSection />
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
| Hold (`TENANTS_HOLD_VH`) | The tenants scene stays put |
| Event transition (`EVENT_VH`) | The tenants photos, labels, title and Learn More slide away (photos down behind their cells, text behind its masks). The grid rules draw in (verticals rise from the bottom, as in the hero) and **stay**: unlike the hero they never retract. Black panels cover the cells one column after another from the right, each column filling as one sweep from the bottom up (a staircase of black). What remains is a black screen with the grid (the event section, to be built). The navbar keeps working and reads white on the black |
| Event (`EVENT_SHOW_VH`) | On the black screen the "EVENT" title, the copy and two buttons slide up from behind their masks (title, paragraph line by line, then buttons). They live on the columns of the **last grid row**: the title at its top, then the paragraph (columns 1–3) and the two buttons (columns 4 and 5) vertically centered in the space between the title and the bottom edge. While they rise, the black panels of the two top rows sink back down column by column (`release` in `CoverPanels`), uncovering `videos/event.mp4` behind them (`EventVideo`: filling the two top rows, switched on only once the panels cover everything). The grid rules stay over the video and the last row stays black. The navbar drops its blend mode over the video and is plain white. Buttons are hollow white squares that fill white from left to right on hover; links are still `href="#"`. Copy lives in `EVENT_TITLE` / `EVENT_COPY` in `content/site.ts` |
| Hold (`EVENT_HOLD_VH`) | The event section stays put |
| Footer transition (`FOOTER_VH`) | The event title, copy and buttons slide down behind their masks, and so do the navbar logo and links (**Collaborate stays**, it is `persist`ent). The black panels of the two top rows rise again over the video (`refill` in `CoverPanels`), three cells fade to white, and the footer content slides up (`FooterSection`) |

Intro → about percentages are fractions of that phase only (`at(...)` in `config/timeline.ts`). The phase lengths are set in viewport heights: `INTRO_VH`, `HOLD_VH` and `EXIT_VH`; the stage length and all progress values are derived from them.

### Tenant categories

Clicking a tenant photo (Hobbies, FnB or Fashion) opens that category. The clicked photo stays; the other two cells get the category's two sub photos (`subPhotos` in `content/site.ts`, files in `public/images/tenants/sub-tenant/`) sliding up over them. The three photos are relabelled **Tenant 1–3** (left to right), a list of those names slides up next to the bottom-left title (`TenantPanel`), above a **Learn More ++** link that is always there (same style and + → × hover as in the about section; it stays clickable while a category is open) and the cursor reads **"Close"** everywhere. A click anywhere (an invisible full-scene button) or `Esc` slides the sub photos back down, so the user can pick another category. The navbar stays usable while a category is open. Scrolling back out of the scene also resets it. All three categories work the same way.

Every photo carries the tenant it shows (`name` in `content/site.ts`); once a category is open that name is the photo's label, so labels always follow their photo. `tenants` is the order the list shows them. Hobbies: Pensil dan Kertas (`2.JPG`), Shadow Goods (`hobbies-1.JPG`), The Throne Room (`hobbies-2.JPG`). Fashion: Wearbobe (`3.JPG`), Lil public (`fashion-1.JPG`), eternalworks (`fashion-2.JPG`). FnB: Gelora Fantasi (`1.JPG`), Kedai Jaya Bersama (`FnB-1.jpeg`), Rameninpo (`FnB-2.jpeg`). Source photos with transparent side bars need `zoom` to crop them (a bar of 12.5% per side → `zoom: 1.34`). File names are case-sensitive on Linux hosts (`2.JPG`, `hobbies-1.JPG`).

### Mobile

Below 768px there is no scroll stage: `MobileLayout` is a plain stack of cards that follow the hero in the same order, each one riding up (rounded top corners, `-mt-8`) over the bottom of the one before it. There is no scroll-driven animation.

| Card (id) | Content |
| --- | --- |
| Hero (`hero`) | Full-screen video, logo, tagline, hashtags |
| About (`about`) | Title, photo, opening hours, paragraphs, Learn More ++ |
| Tenants (`tenants`) | One photo per category; tap one to list its tenants (the other two photos with names), tap again to close; Join call to action |
| Event (`event`) | Video (loaded only when near the viewport, `LazyVideo`), title, copy, two buttons |
| Footer | "Be part of us?", address and email, link blocks (page links, Come Find Us, social), copyright and legal |

A fixed top bar (white with `mix-blend-difference` so it reads on light and dark cards) holds the logo (back to the top) and Collaborate ++, which opens the same sidebar as on desktop. Section links scroll to the card with that id (`SiteLink` falls back to `scrollIntoView` when there is no stage). All copy and links come from `content/site.ts`, shared with desktop.

### Links

`SiteLink` renders every site link. Targets live in `content/site.ts`:

- **Section links** (`{ section: "tenants" | "event" | "hero" }`): on desktop glide the page to that section's resting scroll position (`SECTION_PROGRESS` in `config/timeline.ts`; the stage exposes the glide through `ScrollControlContext`, used via `useGoToSection`). Tenants and Event (navbar and footer) use these, and the navbar logo goes to the hero. The glide takes longer for longer trips and stops as soon as the user scrolls, touches or presses a key.
- **External links** (`{ href, external: true }`): open in a new tab (`noopener noreferrer`). Visit (navbar and footer) and "Come Find Us" go to the Google Maps link, Instagram to the Hallway Space profile; both URLs are in `LINKS`.
- Still `href="#"` placeholders: Learn More, Join, the two event buttons, LinkedIn, Privacy policy and Terms & conditions.

### Footer

`FooterSection` is laid out cell by cell on the 5×3 grid (white cells: page links at col 1 row 2, "Come Find Us" at col 4 row 2, social links at col 2 row 3, set in `FOOTER_WHITE_CELLS`):

| Cell (col, row) | Content |
| --- | --- |
| (2, 1) | Address and email |
| (3, 1) | "Be part of us?" (bottom right of the cell) |
| (5, 1) | the navbar's **Collaborate ++** (it stays on screen) |
| (1, 2) white | Page links (the navbar items: Tenants, Event, Visit) |
| (4, 2) white | "Come Find Us" with an arrow |
| (1, 3) | ©2026 Hallwayspace |
| (2, 3) white | Instagram, LinkedIn |
| (5, 3) | Privacy policy, Terms & conditions |

Copy lives in `FOOTER_COPY` in `content/site.ts`.

### Tenants call to action

`TenantsCta` sits centered between the Hobbies and Fashion photos (the two middle columns of the photo row): "Be one of them." / "Join Berniaga di Selasar." in a size between the body text and the "Tenants" title, plus a hollow square **Join** button. On hover a dark fill sweeps across the button from left to right and the label turns white; it keeps the native cursor (`data-cursor-native`) and stays clickable while a category is open. Copy lives in `TENANTS_CTA` in `content/site.ts`; the link is still `href="#"`.

### Tenants cursor

`TenantsCursor` swaps the mouse cursor for a hollow circle (white + `mix-blend-difference`, so it reads on white, black and photos) once the tenants scene starts (`BLACK_START`). It reads "Click one" and changes to the label of the element under it: anything with a `data-cursor-label` attribute, e.g. a tenant photo and its label ("Learn more"; "Close" while a category is open). The native cursor comes back over the navbar, the collaborate dialog and anything marked `data-cursor-native` (the Learn More ++ link, whose + → × hover then plays as usual), and the effect is off on touch devices (`(pointer: fine)` only).

### Shared transition components

`CoverPanels` grows panels over a set of cells column by column from the right (`fill` colour, growth `origin`, optional `rise` so a column fills bottom-to-top as one sweep). `GridLines` takes a `timing` (`HERO_LINES` draws then retracts, `EVENT_LINES` draws and stays). `GridTransition` wires them in white for hero → about (plus the photo); `EventTransition` wires them in black for tenants → event. Timing lives in `config/timeline.ts`.

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
