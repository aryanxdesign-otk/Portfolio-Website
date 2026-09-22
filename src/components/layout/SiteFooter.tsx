import { cacheLife } from "next/cache";

import type { SanityImageWithMeta } from "@/sanity/lib/image";

import { SocialIcon } from "./SocialIcon";
import { TrustedBy } from "./TrustedBy";

/**
 * The copyright year.
 *
 * Reading the clock during a prerender is non-deterministic, so Cache
 * Components blocks it. Behind `use cache` the value resolves once and
 * refreshes daily, which is far more often than a year boundary needs.
 */
async function getCurrentYear(): Promise<number> {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

type Social = {
  platform: string | null;
  label: string | null;
  url: string | null;
};

/** A circular social button, optionally carrying a follower count. */
function SocialPill({ social }: { social: Social }) {
  if (!social.url || !social.platform) return null;
  const name = social.label ?? social.platform;

  return (
    <a
      href={social.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={name}
      className="border-bg/20 text-bg hover:bg-bg hover:text-ink inline-flex items-center gap-1.5 rounded-full border px-2.5 py-2 text-xs transition-colors duration-200"
    >
      <SocialIcon platform={social.platform} className="size-3.5" />
      {/* Labels that are a bare count sit beside the icon; names do not, or
          the row becomes a wall of text. */}
      {social.label && /^[\d,]+$/.test(social.label) ? (
        <span className="tabular-nums">{social.label}</span>
      ) : null}
    </a>
  );
}

function Column({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-bg/45 text-sm">{label}</h3>
      <div className="mt-2">{children}</div>
    </div>
  );
}

/**
 * The footer, rendered on every page from the root layout.
 *
 * Three bands: the client strip on the light surface, a dark contact block,
 * and an oversized wordmark bleeding off the bottom edge.
 */
export async function SiteFooter({
  email,
  socials,
  footerNote,
  name,
  clients,
  bookingUrl,
  wordmark,
  headingLead,
  headingRest,
}: {
  email?: string | null;
  socials: Social[];
  footerNote?: string | null;
  name: string;
  clients: {
    name: string | null;
    url: string | null;
    logo: SanityImageWithMeta | null;
  }[];
  bookingUrl?: string | null;
  wordmark?: string | null;
  headingLead?: string | null;
  headingRest?: string | null;
}) {
  const year = await getCurrentYear();

  return (
    <footer className="mt-auto">
      <TrustedBy clients={clients} />

      {/* Dark band. Rounded to sit inside the page frame's bottom corners. */}
      <div className="bg-ink text-bg overflow-hidden rounded-b-(--radius-frame) px-6 pt-14 md:px-8 md:pt-20">
        {headingLead || headingRest ? (
          <h2 className="max-w-[16ch] text-3xl leading-[1.08] font-medium tracking-tight">
            {headingLead ? (
              <span className="text-bg">{headingLead}</span>
            ) : null}
            {headingLead && headingRest ? " " : null}
            {headingRest ? (
              <span className="text-bg/45">{headingRest}</span>
            ) : null}
          </h2>
        ) : null}

        <div className="mt-12 flex flex-wrap gap-x-16 gap-y-8">
          {email ? (
            <Column label="Email">
              <a
                href={`mailto:${email}`}
                className="decoration-bg/30 hover:decoration-bg underline underline-offset-4 transition-colors"
              >
                {email}
              </a>
            </Column>
          ) : null}

          {bookingUrl ? (
            <Column label="Call Me">
              <a
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="decoration-bg/30 hover:decoration-bg underline underline-offset-4 transition-colors"
              >
                Book Now
              </a>
            </Column>
          ) : null}

          {socials.length > 0 ? (
            <Column label="Social">
              <ul className="flex flex-wrap items-center gap-2">
                {socials.map((social) => (
                  <li key={social.url}>
                    <SocialPill social={social} />
                  </li>
                ))}
              </ul>
            </Column>
          ) : null}
        </div>

        <p className="border-bg/15 text-bg/40 mt-12 border-t pt-6 text-sm">
          {footerNote ?? `© ${year} — ${name}`}
        </p>

        {/* Oversized wordmark. Sized in vw so it spans the frame at any
            width, and cropped by the band's overflow so it reads as bleeding
            off the page rather than as a word that happens to be large. */}
        {wordmark ? (
          <p
            aria-hidden="true"
            className="text-bg -mb-[0.22em] pt-8 text-center leading-[0.78] font-semibold tracking-[-0.04em] select-none"
            style={{ fontSize: "clamp(4rem, 19vw, 20rem)" }}
          >
            {wordmark}
          </p>
        ) : null}
      </div>
    </footer>
  );
}
