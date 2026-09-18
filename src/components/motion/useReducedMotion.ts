"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void): () => void {
  const query = window.matchMedia(QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getSnapshot(): boolean {
  return window.matchMedia(QUERY).matches;
}

/**
 * Whether this visitor asked for reduced motion.
 *
 * The server snapshot is `true`, so the first paint is always the still
 * version. Correcting from still to animated is invisible; correcting the
 * other way would mean someone sensitive to motion has already seen it.
 *
 * useSyncExternalStore rather than useEffect + setState: the media query is
 * external state React should subscribe to, and this keeps the server and
 * client snapshots explicit instead of racing through an effect.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => true);
}
