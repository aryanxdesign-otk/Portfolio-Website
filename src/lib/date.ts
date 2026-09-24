/**
 * Formats an ISO date for display.
 *
 * Fixed to en-GB rather than the visitor's locale: the server prerenders these
 * pages, so a locale-dependent format would bake one visitor's convention into
 * static HTML served to everyone.
 */
export function formatDate(
  value: string | null | undefined,
  style: "long" | "year" = "long",
): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  if (style === "year") return String(date.getUTCFullYear());

  return new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
