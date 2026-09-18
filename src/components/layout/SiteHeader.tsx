import Link from "next/link";

import { ThemeToggle } from "./ThemeToggle";

/**
 * Minimal header: the name as a home link, the nav, and the theme toggle.
 * Nav labels come from siteSettings so they are editable without a deploy.
 */
export function SiteHeader({
  name,
  navLinks,
}: {
  name: string;
  navLinks: { label: string | null; href: string | null }[];
}) {
  return (
    <header className="container-page pt-10 pb-2 md:pt-16">
      <nav className="flex items-center justify-between gap-6">
        <Link
          href="/"
          className="text-ink hover:text-ink-muted text-sm font-medium transition-colors"
        >
          {name}
        </Link>

        <div className="flex items-center gap-5">
          {navLinks.map((link) =>
            link.href && link.label ? (
              <Link
                key={link.href}
                href={link.href as never}
                className="text-ink-muted hover:text-ink text-sm transition-colors"
              >
                {link.label}
              </Link>
            ) : null,
          )}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
