/**
 * The keys of every registered interaction.
 *
 * Deliberately separate from registry.tsx, which imports React components —
 * the Sanity schema needs this list to validate `componentKey`, and pulling
 * components into the Studio bundle for the sake of an array of strings would
 * be silly. Keep the two in step; `npm run check:ui` asserts they agree.
 */
export const INTERACTION_KEYS = [
  "magnetic-button",
  "spring-toggle",
  "elastic-tabs",
] as const;

export type InteractionKey = (typeof INTERACTION_KEYS)[number];
