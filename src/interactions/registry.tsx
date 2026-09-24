import { ElasticTabs } from "./elastic-tabs";
import { INTERACTION_KEYS, type InteractionKey } from "./keys";
import { MagneticButtonDemo } from "./magnetic-button";
import { SpringToggle } from "./spring-toggle";

/**
 * Maps a Sanity `componentKey` onto the component that renders it.
 *
 * Static imports rather than dynamic ones: there are three of them, they are
 * tiny, and a static map means a missing entry is a type error at build time
 * instead of a blank panel in production.
 *
 * `sourcePath` is relative to the repo root and is read at build time so the
 * code shown on the page is always the code that is running.
 */
export const INTERACTIONS: Record<
  InteractionKey,
  { Component: React.ComponentType; sourcePath: string }
> = {
  "magnetic-button": {
    Component: MagneticButtonDemo,
    sourcePath: "src/interactions/magnetic-button/index.tsx",
  },
  "spring-toggle": {
    Component: SpringToggle,
    sourcePath: "src/interactions/spring-toggle/index.tsx",
  },
  "elastic-tabs": {
    Component: ElasticTabs,
    sourcePath: "src/interactions/elastic-tabs/index.tsx",
  },
};

export function getInteraction(key: string | null | undefined) {
  if (!key) return null;
  return INTERACTIONS[key as InteractionKey] ?? null;
}

export { INTERACTION_KEYS, type InteractionKey };
