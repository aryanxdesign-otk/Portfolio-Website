/**
 * The three collections the home page surfaces as decks.
 *
 * Each is now its own Sanity type and its own route root, so this module
 * carries presentation only — titles, descriptions and where each deck points.
 */
export const COLLECTIONS = [
  {
    key: "case-studies",
    href: "/case-studies",
    title: "Design Case Studies",
    singular: "case study",
    plural: "case studies",
    description: "End-to-end product work, from problem to shipped.",
  },
  {
    key: "interactions",
    href: "/interactions",
    title: "Front End Micro Interactions",
    singular: "interaction",
    plural: "interactions",
    description: "Small, precise pieces of interface motion, built in code.",
  },
  {
    key: "visual",
    href: "/visual",
    title: "Visual Design + Brand",
    singular: "visual project",
    plural: "visual projects",
    description: "Identity, type and visual systems.",
  },
] as const;

export type CollectionKey = (typeof COLLECTIONS)[number]["key"];

export function getCollection(key: CollectionKey) {
  return COLLECTIONS.find((c) => c.key === key)!;
}
