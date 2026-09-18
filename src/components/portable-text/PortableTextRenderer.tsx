import { PortableText, type PortableTextBlock } from "@portabletext/react";

import { portableTextComponents } from "./blocks";

/**
 * Renders a Portable Text body with the site's block components.
 *
 * Pages call this rather than PortableText directly, so every body on the
 * site renders through the same component map.
 */
export function PortableTextRenderer({
  value,
}: {
  value: PortableTextBlock[] | null | undefined;
}) {
  if (!value || value.length === 0) return null;

  return <PortableText value={value} components={portableTextComponents} />;
}
