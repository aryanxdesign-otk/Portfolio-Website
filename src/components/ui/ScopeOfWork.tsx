/**
 * The labelled pill row beneath a case study's intro.
 */
export function ScopeOfWork({
  label = "Scope of Work",
  items,
}: {
  label?: string;
  items: string[] | null | undefined;
}) {
  if (!items || items.length === 0) return null;

  return (
    <section aria-label={label} className="mt-10">
      <h2 className="text-ink-faint text-sm">{label}</h2>
      <ul className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <li
            key={item}
            className="border-line text-ink rounded-full border px-4 py-2 text-sm"
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
