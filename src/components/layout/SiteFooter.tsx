import {
  LogoMarquee,
  type ClientLogo,
} from "@/components/sections/LogoMarquee";
import { SocialLinks, type Social } from "@/components/ui/SocialLinks";
import { TwoTone, type TwoToneHeading } from "@/components/ui/TwoTone";

/**
 * The closing band: the call to action, contact details, and the oversized
 * wordmark that bleeds off the bottom of the page.
 *
 * This is the only inverted surface on the site, which is why the palette
 * flips here rather than being themed — see the note in globals.css.
 */
export function SiteFooter({
  ctaHeading,
  wordmark,
  email,
  bookingUrl,
  bookingLabel,
  socials,
  clients,
  clientsLabel,
  clientLogos,
}: {
  ctaHeading: TwoToneHeading;
  wordmark?: string | null;
  email?: string | null;
  bookingUrl?: string | null;
  bookingLabel?: string | null;
  socials: Social[];
  clients: ClientLogo[];
  clientsLabel?: string | null;
  clientLogos?: React.ReactNode[];
}) {
  return (
    <>
      {clients.length > 0 ? (
        <section
          aria-label="Clients"
          className="border-line relative z-10 border-t py-10"
        >
          <div className="container-page">
            <LogoMarquee
              logos={clients}
              media={clientLogos}
              label={clientsLabel}
              speed={55}
            />
          </div>
        </section>
      ) : null}

      <footer className="bg-bg-inverse text-ink-inverse relative z-10 overflow-hidden">
        <div className="container-page pt-(--space-section)">
          <TwoTone
            heading={ctaHeading}
            tone="inverse"
            stack
            className="text-display-lg max-w-[26ch]"
          />

          <div className="mt-16 grid gap-10 sm:grid-cols-3">
            {email ? (
              <Detail label="Email">
                <a
                  href={`mailto:${email}`}
                  className="hover:text-ink-inverse-muted transition-colors"
                >
                  {email}
                </a>
              </Detail>
            ) : null}

            {bookingUrl ? (
              <Detail label="Call Me">
                <a
                  href={bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ink-inverse-muted transition-colors"
                >
                  {bookingLabel ?? "Book Now"}
                </a>
              </Detail>
            ) : null}

            {socials.length > 0 ? (
              <Detail label="Social">
                <SocialLinks socials={socials} tone="dark" />
              </Detail>
            ) : null}
          </div>

          <hr className="mt-12 border-white/15" />
        </div>

        {wordmark ? <Wordmark text={wordmark} /> : null}
      </footer>
    </>
  );
}

function Detail({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-ink-inverse-muted text-base">{label}</p>
      <div className="text-ink-inverse mt-2 text-base">{children}</div>
    </div>
  );
}

/**
 * The oversized wordmark, sharp at the top and dissolving toward the bottom
 * edge it bleeds off.
 *
 * CSS cannot ramp a blur across an element, so the effect is three copies of
 * the same word at increasing blur, each masked to its own horizontal band.
 * The bands overlap slightly so the seams between them don't read as lines.
 *
 * It is decorative — the word is already the site's subject — so the whole
 * thing is hidden from assistive technology rather than announced three times.
 */
function Wordmark({ text }: { text: string }) {
  // Each layer is the same word at a different blur, faded in over the one
  // above it. The mask stops are soft and overlap generously — with hard
  // stops the sharp layer ends on a visible edge and the blurred layer, which
  // spreads past its own mask, reads as a second ghosted copy of the word.
  const layers = [
    {
      blur: 0,
      mask: "linear-gradient(to bottom, black 0%, black 18%, transparent 52%)",
    },
    {
      blur: 6,
      mask: "linear-gradient(to bottom, transparent 14%, black 42%, black 58%, transparent 84%)",
    },
    {
      blur: 18,
      mask: "linear-gradient(to bottom, transparent 48%, black 82%, black 100%)",
    },
  ];

  return (
    <div
      aria-hidden="true"
      className="relative mt-10 h-[0.58em] w-full text-(length:--text-wordmark) select-none"
    >
      {layers.map((layer) => (
        <span
          key={layer.blur}
          className="absolute inset-x-0 top-0 block text-center leading-none font-semibold tracking-[-0.045em] text-white"
          style={{
            filter: layer.blur ? `blur(${layer.blur}px)` : undefined,
            maskImage: layer.mask,
            WebkitMaskImage: layer.mask,
          }}
        >
          {text}
        </span>
      ))}
    </div>
  );
}
