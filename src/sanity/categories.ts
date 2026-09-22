/**
 * The three work categories the home page surfaces as cards.
 *
 * Kept in a module with no imports so schemas, queries, pages and the URL
 * filter all read the same list — adding a fourth category means editing
 * exactly one array.
 */
export const CATEGORIES = [
  {
    value: "case-studies",
    title: "Design Case Studies",
    short: "case studies",
    description: "End-to-end product work, from problem to shipped.",
  },
  {
    value: "micro-interactions",
    title: "Front End Micro Interactions",
    short: "micro interactions",
    description: "Small, precise pieces of interface motion, built in code.",
  },
  {
    value: "brand",
    title: "Visual Design + Brand",
    short: "visual & brand",
    description: "Identity, type and visual systems.",
  },
] as const;

export type CategoryValue = (typeof CATEGORIES)[number]["value"];

export const CATEGORY_VALUES = CATEGORIES.map((c) => c.value);

export function isCategory(value: string | undefined): value is CategoryValue {
  return Boolean(value) && CATEGORY_VALUES.includes(value as CategoryValue);
}

export function getCategory(value: string | undefined) {
  return CATEGORIES.find((c) => c.value === value);
}
