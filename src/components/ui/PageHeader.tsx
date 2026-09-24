import { BackLink } from "./BackLink";

/**
 * The header every collection and detail page opens with: a way back, a
 * title, and an optional line beneath.
 */
export function PageHeader({
  title,
  description,
  backHref = "/",
  backLabel = "Home",
  children,
}: {
  title: string;
  description?: string | null;
  backHref?: string;
  backLabel?: string;
  children?: React.ReactNode;
}) {
  return (
    <header>
      <BackLink href={backHref}>{backLabel}</BackLink>

      <h1 className="mt-6 max-w-[22ch] text-2xl font-medium tracking-tight text-balance">
        {title}
      </h1>

      {description ? (
        <p className="text-ink-muted mt-3 max-w-[58ch] leading-relaxed">
          {description}
        </p>
      ) : null}

      {children}
    </header>
  );
}
