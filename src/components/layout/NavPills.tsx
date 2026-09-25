"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { cn } from "@/lib/cn";

/**
 * Static fallback rendered while the active-pill version streams in.
 *
 * Identical markup minus the pill, so the header does not shift when the
 * real nav resolves.
 */
export function NavPillsFallback({
  links,
}: {
  links: { label: string | null; href: string | null }[];
}) {
  return (
    <nav className="flex flex-wrap items-center justify-center gap-1">
      {links.map((link) =>
        link.href && link.label ? (
          <Link
            key={link.href}
            href={link.href as never}
            className="text-ink-muted hover:text-ink rounded-full px-3.5 py-1.5 text-sm transition-colors"
          >
            {link.label}
          </Link>
        ) : null,
      )}
    </nav>
  );
}

/**
 * Centre nav. The active item sits in a filled pill that slides between
 * items on navigation, via a shared layoutId — one element moving rather
 * than one fading out while another fades in.
 *
 * The pill is decorative; `aria-current` on the link is what actually
 * communicates the active page.
 *
 * usePathname is request-time data, so this must render inside a Suspense
 * boundary — otherwise every route that includes the header, /studio
 * included, is forced to render dynamically.
 */
export function NavPills({
  links,
}: {
  links: { label: string | null; href: string | null }[];
}) {
  const pathname = usePathname();
  const reduced = useReducedMotion();

  return (
    <nav className="flex flex-wrap items-center justify-center gap-1">
      {links.map((link) => {
        if (!link.href || !link.label) return null;

        const isActive =
          link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href as never}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "relative rounded-full px-3.5 py-1.5 text-sm transition-colors",
              isActive ? "text-ink" : "text-ink-muted hover:text-ink",
            )}
          >
            {isActive ? (
              <motion.span
                // Shared id is what lets the pill travel between items.
                layoutId="nav-pill"
                className="bg-bg-inset absolute inset-0 rounded-full"
                transition={
                  reduced
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 380, damping: 32 }
                }
              />
            ) : null}
            <span className="relative">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
