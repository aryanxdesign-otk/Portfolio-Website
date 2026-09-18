import { PortableText } from "@portabletext/react";

import { portableTextComponents } from "./blocks";

/**
 * Renders a Portable Text body with the site's block components.
 *
 * The `value` type is deliberately structural rather than @portabletext's own
 * `PortableTextBlock[]`. Typegen emits `markDefs: T[] | null` (nullable,
 * because this site renders partial data), while the library's type expects
 * `markDefs?: T[]` (optional). The shapes are runtime-compatible — null and
 * absent both mean "no annotations" to the renderer — so this accepts what
 * the queries actually produce and narrows at the single call site below.
 */
export function PortableTextRenderer({
  value,
}: {
  value: readonly { _type: string; _key: string }[] | null | undefined;
}) {
  if (!value || value.length === 0) return null;

  return (
    <PortableText
      value={value as React.ComponentProps<typeof PortableText>["value"]}
      components={portableTextComponents}
    />
  );
}
