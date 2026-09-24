/**
 * The date / role / client strip at the top of a detail page.
 *
 * A definition list rather than styled divs, so a screen reader announces
 * "Role: Product design" instead of two unrelated fragments.
 */
export function MetaRow({
  items,
}: {
  items: { label: string; value: string | null | undefined }[];
}) {
  const present = items.filter((item) => item.value);
  if (present.length === 0) return null;

  return (
    <dl className="border-line text-ink-muted mt-10 flex flex-wrap gap-x-10 gap-y-4 border-t pt-6 font-mono text-xs">
      {present.map((item) => (
        <div key={item.label}>
          <dt className="text-ink-faint">{item.label}</dt>
          <dd className="text-ink-muted mt-1">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
