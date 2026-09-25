/**
 * The inline `Project X   Year Y` row under a case study title.
 *
 * A definition list rather than styled spans, so the pairing survives for a
 * screen reader — "Project: Fireplace Pro" instead of two loose fragments.
 */
export function ProjectMeta({
  items,
}: {
  items: { label: string; value: string | null | undefined }[];
}) {
  const present = items.filter((item) => item.value);
  if (present.length === 0) return null;

  return (
    <dl className="mt-8 flex flex-wrap items-baseline gap-x-10 gap-y-2 text-sm">
      {present.map((item) => (
        <div key={item.label} className="flex items-baseline gap-2.5">
          <dt className="text-ink-faint">{item.label}</dt>
          <dd className="text-ink font-medium">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
