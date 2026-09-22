"use client";

import { motion } from "motion/react";
import Link from "next/link";

import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { cn } from "@/lib/cn";
import { CATEGORIES, type CategoryValue } from "@/sanity/categories";

/**
 * Category filter for the work page.
 *
 * Real links rather than buttons, so the filter lives in the URL: a filtered
 * view can be shared, bookmarked and reached by the home page cards, and the
 * back button does what people expect.
 */
export function CategoryFilter({ active }: { active: CategoryValue | null }) {
  const reduced = useReducedMotion();

  const options = [
    { value: null, label: "All", href: "/work" },
    ...CATEGORIES.map((c) => ({
      value: c.value as CategoryValue | null,
      label: c.title,
      href: `/work?category=${c.value}`,
    })),
  ];

  return (
    <div className="border-line -mx-1 flex flex-wrap gap-1 border-b pb-4">
      {options.map((option) => {
        const isActive = option.value === active;
        return (
          <Link
            key={option.label}
            href={option.href as never}
            aria-current={isActive ? "true" : undefined}
            className={cn(
              "relative rounded-full px-3.5 py-1.5 text-sm transition-colors",
              isActive ? "text-ink" : "text-ink-muted hover:text-ink",
            )}
          >
            {isActive ? (
              <motion.span
                layoutId="filter-pill"
                className="bg-bg-inset absolute inset-0 rounded-full"
                transition={
                  reduced
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 380, damping: 32 }
                }
              />
            ) : null}
            <span className="relative">{option.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
