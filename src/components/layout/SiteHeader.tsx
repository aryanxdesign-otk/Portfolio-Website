import Link from "next/link";
import { Suspense } from "react";

import { CtaButton } from "@/components/ui/CtaButton";

import { NavPills, NavPillsFallback } from "./NavPills";
import { ThemeToggle } from "./ThemeToggle";

/**
 * Avatar and name on the left, nav centred, contact CTA on the right.
 *
 * On narrow screens the nav drops below the row rather than collapsing into
 * a menu — with three items a hamburger would hide less than it costs.
 */
export function SiteHeader({
  name,
  navLinks,
  email,
  initials,
}: {
  name: string;
  navLinks: { label: string | null; href: string | null }[];
  email?: string | null;
  initials: string;
}) {
  return (
    <header className="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between md:px-8 md:py-6">
      <div className="flex items-center justify-between gap-3 md:justify-start">
        <Link href="/" className="group flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="bg-ink text-bg grid size-8 place-items-center rounded-full text-xs font-semibold"
          >
            {initials}
          </span>
          <span className="text-ink group-hover:text-ink-muted text-sm font-medium transition-colors">
            {name}
          </span>
        </Link>
        <div className="md:hidden">
          <ThemeToggle />
        </div>
      </div>

      <div className="md:absolute md:left-1/2 md:-translate-x-1/2">
        <Suspense fallback={<NavPillsFallback links={navLinks} />}>
          <NavPills links={navLinks} />
        </Suspense>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:block">
          <ThemeToggle />
        </div>
        {email ? (
          <CtaButton href={`mailto:${email}`}>Let&rsquo;s chat</CtaButton>
        ) : null}
      </div>
    </header>
  );
}
