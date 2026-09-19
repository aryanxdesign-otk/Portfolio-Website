"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { cn } from "@/lib/cn";

const SCROLL_THRESHOLD = 40;

/**
 * The floating pill nav.
 *
 * It starts collapsed — just the wordmark and a "more" affordance — and
 * expands into the full link set once the page has scrolled. That is the
 * inverse of the usual pattern, and it is deliberate: at the top of the page
 * the hero is the navigation.
 *
 * The links are genuinely absent from the DOM while collapsed rather than
 * hidden with CSS, so they can't be focused invisibly. The "more" button is
 * a real button with aria-expanded, which gives keyboard and touch users a
 * way to open the nav without scrolling.
 */
export function SiteNav({
  name,
  navLinks,
}: {
  name: string;
  navLinks: { label: string | null; href: string | null }[];
}) {
  const [scrolled, setScrolled] = useState(false);
  const [openedByUser, setOpenedByUser] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll(); // The page may already be scrolled on load or on back-navigation.
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = navLinks.filter((link) => link.href && link.label);
  const expanded = (scrolled || openedByUser) && links.length > 0;

  return (
    <header className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-(--space-gutter)">
      <motion.nav
        aria-label="Main"
        layout={!reduced}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "bg-bg-raised shadow-raised rounded-pill pointer-events-auto",
          "flex items-center gap-1 p-1.5 pl-2.5",
        )}
      >
        <motion.div layout={!reduced} className="shrink-0">
          <Link
            href="/"
            className="text-ink flex items-center gap-2 rounded-full py-1.5 pr-2 pl-0.5 text-base font-medium"
          >
            <Mark />
            <span className="whitespace-nowrap">{name}</span>
          </Link>
        </motion.div>

        <AnimatePresence mode="popLayout" initial={false}>
          {expanded ? (
            <motion.div
              key="links"
              layout={!reduced}
              initial={reduced ? false : { opacity: 0, filter: "blur(4px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={reduced ? undefined : { opacity: 0, filter: "blur(4px)" }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-1"
            >
              {links.map((link, index) => {
                // The last link is the call to action, and is chipped.
                const isCta = index === links.length - 1;
                return (
                  <Link
                    key={link.href}
                    href={link.href as never}
                    className={cn(
                      "rounded-pill px-3.5 py-1.5 text-base whitespace-nowrap transition-colors",
                      isCta
                        ? "bg-bg-raised ring-line text-ink shadow-raised ring-1"
                        : "text-ink hover:text-ink-subtle",
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </motion.div>
          ) : (
            <motion.button
              key="more"
              type="button"
              layout={!reduced}
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduced ? undefined : { opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpenedByUser(true)}
              aria-expanded={false}
              aria-label="Show navigation"
              className="text-ink-muted hover:text-ink flex items-center gap-1 rounded-full px-3 py-2.5 transition-colors"
            >
              <Dot />
              <Dot />
              <Dot />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.nav>
    </header>
  );
}

function Dot() {
  return (
    <span
      aria-hidden="true"
      className="block size-1.5 rounded-full bg-current"
    />
  );
}

/** The avatar tile — a four-point star on a black square. */
function Mark() {
  return (
    <span
      aria-hidden="true"
      className="bg-ink text-ink-inverse flex size-7 shrink-0 items-center justify-center rounded-[0.5rem]"
    >
      <svg viewBox="0 0 16 16" className="size-3.5" fill="currentColor">
        <path d="M8 0c.4 3.9 3.7 7.2 7.6 7.6v.8C11.7 8.8 8.4 12.1 8 16h-.8C6.8 12.1 3.5 8.8-.4 8.4v-.8C3.5 7.2 6.8 3.9 7.2 0h.8z" />
      </svg>
    </span>
  );
}
