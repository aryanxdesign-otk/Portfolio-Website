import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge class names, with later Tailwind utilities winning over earlier ones.
 * Without twMerge, `cn("p-4", "p-8")` would emit both and let source order
 * in the stylesheet decide — which is not what any caller means.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
