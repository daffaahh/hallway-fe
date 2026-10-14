import { SiteLink } from "@/components/ui/SiteLink";
import { FOOTER_COPY, NAV_ITEMS } from "@/content/site";
import Card from "./Card";

const linkList = "flex flex-col gap-4 bg-white p-6 text-neutral-900";
const link = "block w-fit text-xl font-bold uppercase tracking-wide";

/** Footer card: invitation, contact, link blocks, copyright and legal. */
export default function MobileFooter() {
  return (
    <Card className="bg-black text-white">
      <p className="text-3xl font-extrabold uppercase leading-tight tracking-tight">
        {FOOTER_COPY.invite}
      </p>

      <div className="mt-6 flex flex-col gap-4 text-sm font-medium leading-snug">
        <p>{FOOTER_COPY.address}</p>
        <a href={`mailto:${FOOTER_COPY.email}`} className="w-fit underline">
          {FOOTER_COPY.email}
        </a>
      </div>

      <div className="mt-10 flex flex-col gap-3">
        <div className={linkList}>
          {NAV_ITEMS.map((item) => (
            <SiteLink key={item.label} target={item} className={link}>
              {item.label}
            </SiteLink>
          ))}
        </div>

        <SiteLink
          target={FOOTER_COPY.findUs}
          className="flex min-h-40 flex-col justify-between bg-white p-6 text-neutral-900"
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 36 36"
            fill="none"
            aria-hidden
            className="self-end"
          >
            <path
              d="M6 30L30 6M12 6h18v18"
              stroke="currentColor"
              strokeWidth="3"
            />
          </svg>
          <span className="text-4xl font-extrabold uppercase leading-[0.95] tracking-tight">
            {FOOTER_COPY.findUs.label}
          </span>
        </SiteLink>

        <div className={linkList}>
          {FOOTER_COPY.social.map((item) => (
            <SiteLink key={item.label} target={item} className={link}>
              {item.label}
            </SiteLink>
          ))}
        </div>
      </div>

      <div className="mt-12 flex items-end justify-between gap-6 text-sm">
        <p>{FOOTER_COPY.copyright}</p>
        <div className="flex flex-col items-end gap-1">
          {FOOTER_COPY.legal.map((item) => (
            <a key={item.label} href={item.href}>
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </Card>
  );
}
