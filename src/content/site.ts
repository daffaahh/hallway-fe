import type { SectionKey } from "@/config/timeline";

export const TAGLINE = "Rise of the Local Future";

export const HASHTAGS = [
  "#NongkrongDiPasar",
  "#BelanjaDiPasar",
  "#PameranDiPasar",
];

export const LINKS = {
  maps: "https://maps.app.goo.gl/nJAqeVHMwwJAt5np9",
  instagram: "https://www.instagram.com/thehallwayspace_/",
};

/** A link to a section of the page, or out to another site. */
export type LinkTarget =
  { section: SectionKey } | { href: string; external?: boolean };

export const NAV_ITEMS: ({ label: string } & LinkTarget)[] = [
  { label: "Tenants", section: "tenants" },
  { label: "Event", section: "event" },
  { label: "Visit", href: LINKS.maps, external: true },
];

export const ABOUT_TITLE = "The Hallway";

export const ABOUT_PARAGRAPHS = [
  "The Hallway Space is an independent, collectively run creative space on the second floor of Pasar Kosambi, a traditional market in Bandung that has stood since 1915. Tucked above the bustle of the market floor below, its hallways are now home to more than 140 tenants run by young locals, from fashion and hobbies to food & beverage.",
  "More than a place to shop and hang out, we’re a space to build businesses, gather, and collaborate, while breathing new life into one of Bandung’s oldest markets.",
];

export const OPEN_HOURS = "Open Daily : 10.00 - 22.00";

export const TENANTS_TITLE = "Tenants";

export const TENANTS_CTA = {
  lines: ["Be one of them.", "Join Berniaga di Selasar."],
  button: "Join",
};

export type TenantPhoto = {
  src: string;
  /** crops transparent edges out of the source image */
  zoom: number;
  /** the tenant shown in this photo; used as its label once a category is open */
  name: string;
};

export type TenantCard = TenantPhoto & {
  label: string;
  /** which edge of the photo the label lines up with */
  labelSide: "left" | "right";
  /** the two photos that replace the other cards when this category is opened */
  subPhotos: [TenantPhoto, TenantPhoto];
  /** tenant names in the order the list shows them */
  tenants: [string, string, string];
};

// Tenant names, written once so the list and the photo labels cannot drift apart
const HOBBIES = {
  pensil: "Pensil dan Kertas",
  throne: "The Throne Room",
  shadow: "Shadow Goods",
};
const FNB = {
  gelora: "Gelora Fantasi",
  rameninpo: "Rameninpo",
  kedai: "Kedai Jaya Bersama",
};
const FASHION = {
  wearbobe: "Wearbobe",
  eternalworks: "eternalworks",
  lilPublic: "Lil public",
};

// Left to right, matching TENANT_PHOTO_CELLS in config/grid.ts.
// `zoom` crops transparent edges (e.g. a source with 12.5% transparent bars on
// each side needs zoom 1 / 0.75).
export const TENANT_CARDS: TenantCard[] = [
  {
    label: "Hobbies",
    src: "/images/tenants/2.JPG",
    zoom: 1,
    name: HOBBIES.pensil,
    labelSide: "right",
    subPhotos: [
      {
        src: "/images/tenants/sub-tenant/hobbies-1.JPG",
        zoom: 1,
        name: HOBBIES.shadow,
      },
      {
        src: "/images/tenants/sub-tenant/hobbies-2.JPG",
        zoom: 1,
        name: HOBBIES.throne,
      },
    ],
    tenants: [HOBBIES.pensil, HOBBIES.throne, HOBBIES.shadow],
  },
  {
    label: "FnB",
    src: "/images/tenants/1.JPG",
    zoom: 1,
    name: FNB.gelora,
    labelSide: "left",
    subPhotos: [
      {
        src: "/images/tenants/sub-tenant/FnB-1.jpeg",
        zoom: 1,
        name: FNB.kedai,
      },
      {
        src: "/images/tenants/sub-tenant/FnB-2.jpeg",
        zoom: 1,
        name: FNB.rameninpo,
      },
    ],
    tenants: [FNB.gelora, FNB.rameninpo, FNB.kedai],
  },
  {
    label: "Fashion",
    src: "/images/tenants/3.JPG",
    zoom: 1,
    name: FASHION.wearbobe,
    labelSide: "left",
    subPhotos: [
      {
        src: "/images/tenants/sub-tenant/fashion-1.JPG",
        zoom: 1,
        name: FASHION.lilPublic,
      },
      {
        src: "/images/tenants/sub-tenant/fashion-2.JPG",
        zoom: 1,
        name: FASHION.eternalworks,
      },
    ],
    tenants: [FASHION.wearbobe, FASHION.eternalworks, FASHION.lilPublic],
  },
];

export const EVENT_TITLE = "Event";

export const EVENT_COPY = {
  paragraph:
    "The Hallway Space has always been more than a place to shop. Our hallways regularly come alive with live music, markets, and community gatherings, and over the years we’ve welcomed acts like Murphy Radio, 510, Birubaru, and many more. Whether it’s a weekend gig or a pop-up market, there’s always a reason to come back.",
  buttons: [
    { label: "See Upcoming Events", href: "#" },
    { label: "Host an Event With Us", href: "#" },
  ],
};

export const FOOTER_COPY = {
  address:
    "Pasar Kosambi Lt. 2, Jl. Kebon Pisang, Kec. Sumur Bandung, Kota Bandung 40112",
  email: "info@hallwayspace.com",
  invite: "Be part of us?",
  findUs: { label: "Come Find Us", href: LINKS.maps, external: true },
  social: [
    { label: "Instagram", href: LINKS.instagram, external: true },
    { label: "LinkedIn", href: "#" },
  ],
  copyright: "©2026 Hallwayspace",
  legal: [
    { label: "Privacy policy", href: "#" },
    { label: "Terms & conditions", href: "#" },
  ],
};

export const ASSETS = {
  video: "/videos/background.mp4",
  logoLight: "/images/logo-white.png",
  logoDark: "/images/logo.png",
  photo: "/images/about.JPG",
  eventVideo: "/videos/event.mp4",
};
