import { cn } from "@/lib/cn";

export type Social = {
  platform: string | null;
  label: string | null;
  url: string | null;
  followerCount?: number | null;
};

/**
 * The row of social pills, used on the portrait and in the footer.
 *
 * A link with a follower count renders as a wider pill carrying the number;
 * the rest are circular icon buttons. Both tones are defined here rather than
 * at the call sites, because the footer sits on black and everything else on
 * white, and that is the only difference between them.
 */
export function SocialLinks({
  socials,
  email,
  tone = "light",
  className,
}: {
  socials: Social[];
  /** When set, an envelope pill is appended. */
  email?: string | null;
  tone?: "light" | "dark";
  className?: string;
}) {
  const items = socials.filter((social) => social.url);
  if (items.length === 0 && !email) return null;

  const surface =
    tone === "dark"
      ? "bg-white text-black hover:bg-white/85"
      : "bg-bg-raised text-ink ring-line/70 shadow-raised ring-1 hover:bg-bg-inset";

  const base = cn(
    "flex h-8 items-center justify-center rounded-pill transition-colors",
    surface,
  );

  return (
    <ul className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {items.map((social) => (
        <li key={social.url}>
          <a
            href={social.url as string}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              base,
              social.followerCount != null ? "gap-1.5 px-3" : "w-8",
            )}
            aria-label={
              social.followerCount != null
                ? `${social.label ?? social.platform}: ${formatCount(social.followerCount)} followers`
                : (social.label ?? social.platform ?? "Profile")
            }
          >
            <PlatformIcon platform={social.platform} />
            {social.followerCount != null ? (
              <span aria-hidden="true" className="text-sm tabular-nums">
                {formatCount(social.followerCount)}
              </span>
            ) : null}
          </a>
        </li>
      ))}

      {email ? (
        <li>
          <a
            href={`mailto:${email}`}
            className={cn(base, "w-8")}
            aria-label={`Email ${email}`}
          >
            <MailIcon />
          </a>
        </li>
      ) : null}
    </ul>
  );
}

/** 1214 → "1,214". Locale-independent so server and client agree. */
function formatCount(value: number): string {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function PlatformIcon({ platform }: { platform: string | null }) {
  switch (platform) {
    case "x":
      return <XIcon />;
    case "linkedin":
      return <LinkedInIcon />;
    case "instagram":
      return <InstagramIcon />;
    default:
      return <LinkIcon />;
  }
}

const icon = "size-3.5 shrink-0";

function XIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className={icon}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12.2 1.5h2.3l-5 5.8 5.9 7.8h-4.6L7.2 10 3.4 15.1H1.1l5.4-6.2L.9 1.5h4.7l3.3 4.4 3.3-4.4zm-.8 12.2h1.3L4.7 2.8H3.3l8.1 10.9z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className={icon}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M3.5 1.5a1.6 1.6 0 100 3.2 1.6 1.6 0 000-3.2zM2.1 6h2.8v8.5H2.1V6zm4.6 0h2.7v1.2a3 3 0 012.6-1.4c2 0 3 1.3 3 3.7v5H12V9.9c0-1.2-.4-1.9-1.4-1.9-.8 0-1.3.6-1.5 1.2v5.3H6.7V6z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className={icon}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden="true"
    >
      <rect x="1.9" y="1.9" width="12.2" height="12.2" rx="3.6" />
      <circle cx="8" cy="8" r="2.9" />
      <circle cx="11.7" cy="4.3" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className={icon}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="1.6" y="3.2" width="12.8" height="9.6" rx="1.8" />
      <path d="M2.4 4.8L8 8.8l5.6-4" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className={icon}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M6.6 9.4a2.8 2.8 0 004.1 0l2-2a2.9 2.9 0 00-4.1-4.1l-.9.9" />
      <path d="M9.4 6.6a2.8 2.8 0 00-4.1 0l-2 2a2.9 2.9 0 004.1 4.1l.9-.9" />
    </svg>
  );
}
