"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

/**
 * Light/dark toggle.
 *
 * The <html data-theme> attribute is the single source of truth — it is set
 * before first paint by the blocking script in theme-script.tsx, and this
 * component reads it rather than keeping a parallel copy in React state.
 *
 * Subscribing via useSyncExternalStore (to both a MutationObserver on the
 * attribute and the OS preference) means no setState-in-effect and no window
 * where the icon disagrees with the actual theme.
 */
export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, () => null);

  const toggle = () => {
    const next: Theme = resolveTheme() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Private browsing or blocked storage — the choice just won't persist.
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      // Before hydration the theme is unknown, so the specific label would be
      // a guess; fall back to a neutral one.
      aria-label={
        theme
          ? `Switch to ${theme === "dark" ? "light" : "dark"} mode`
          : "Toggle theme"
      }
      className="text-ink-faint hover:text-ink -m-2 p-2 transition-colors"
    >
      <span aria-hidden="true" className="block size-4">
        {theme === "dark" ? <SunIcon /> : <MoonIcon />}
      </span>
    </button>
  );
}

/** The theme actually in effect: explicit override, else OS preference. */
function resolveTheme(): Theme {
  const attr = document.documentElement.getAttribute("data-theme");
  if (attr === "dark" || attr === "light") return attr;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function subscribe(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });

  const query = window.matchMedia("(prefers-color-scheme: dark)");
  query.addEventListener("change", onChange);

  return () => {
    observer.disconnect();
    query.removeEventListener("change", onChange);
  };
}

function getSnapshot(): Theme {
  return resolveTheme();
}

function SunIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
    >
      <circle cx="8" cy="8" r="3.25" />
      <path
        strokeLinecap="round"
        d="M8 1v1.5M8 13.5V15M15 8h-1.5M2.5 8H1m11-5l-1 1M5 11l-1 1m0-8l1 1m6 6l1 1"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
    >
      <path
        strokeLinejoin="round"
        d="M13.5 9.5A5.8 5.8 0 016.5 2.5a5.75 5.75 0 107 7z"
      />
    </svg>
  );
}
