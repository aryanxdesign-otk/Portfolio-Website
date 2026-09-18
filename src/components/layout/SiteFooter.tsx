import { cacheLife } from "next/cache";

import { Container } from "@/components/ui/Container";

/**
 * The copyright year.
 *
 * Reading the clock during a prerender is non-deterministic, so Cache
 * Components blocks it. Behind `use cache` the value is resolved once and
 * refreshed daily, which is far more often than a year boundary needs.
 */
async function getCurrentYear(): Promise<number> {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

/**
 * Footer: the closing line from the Framer design, contact, and socials.
 */
export async function SiteFooter({
  ctaHeading,
  email,
  socials,
  footerNote,
  name,
}: {
  ctaHeading?: string | null;
  email?: string | null;
  socials: {
    platform: string | null;
    label: string | null;
    url: string | null;
  }[];
  footerNote?: string | null;
  name: string;
}) {
  const year = await getCurrentYear();

  return (
    <footer className="border-line mt-auto border-t">
      <Container className="py-12 md:py-16">
        {ctaHeading ? (
          <h2 className="text-ink max-w-[18ch] text-xl font-medium">
            {ctaHeading}
          </h2>
        ) : null}

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
          {email ? (
            <a
              href={`mailto:${email}`}
              className="text-ink decoration-line hover:decoration-ink underline underline-offset-[3px] transition-colors"
            >
              {email}
            </a>
          ) : null}

          {socials.map((social) =>
            social.url ? (
              <a
                key={social.url}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-muted hover:text-ink transition-colors"
              >
                {social.label ?? social.platform}
                <span aria-hidden="true" className="ml-0.5">
                  ↗
                </span>
              </a>
            ) : null,
          )}
        </div>

        <p className="text-ink-faint mt-10 font-mono text-xs">
          {footerNote ?? `© ${year} ${name}`}
        </p>
      </Container>
    </footer>
  );
}
