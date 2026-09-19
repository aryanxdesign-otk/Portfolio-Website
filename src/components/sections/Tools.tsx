import { FadeIn } from "@/components/motion/FadeIn";
import { TwoTone, type TwoToneHeading } from "@/components/ui/TwoTone";

export type Tool = {
  name: string | null;
  url?: string | null;
};

/**
 * The tools strip: a heading, a one-line note, and a row of icon chips.
 *
 * Each chip is a white tile on the off-white page — the elevation comes from
 * the surface difference and a soft shadow rather than a border, matching the
 * nav and the buttons. Until an icon is uploaded a chip shows the tool's
 * initial, so the row keeps its shape.
 */
export function Tools({
  heading,
  note,
  tools,
  icons,
}: {
  heading: TwoToneHeading;
  note?: string | null;
  tools: Tool[];
  /** Server-rendered icons, one per tool, in the same order. */
  icons?: React.ReactNode[];
}) {
  const items = tools.filter((tool) => tool.name);
  if (items.length === 0 && !heading?.rest) return null;

  return (
    <section
      aria-labelledby="tools"
      className="border-line relative z-10 border-t py-(--space-section)"
    >
      <div className="container-page">
        <FadeIn y={16}>
          <TwoTone heading={heading} id="tools" className="max-w-[30ch]" />

          {note ? (
            <p className="text-ink mt-10 text-base font-medium">{note}</p>
          ) : null}

          {items.length > 0 ? (
            <ul className="mt-6 flex flex-wrap gap-3">
              {items.map((tool, index) => (
                <li key={`${tool.name}-${index}`}>
                  <ToolChip tool={tool} icon={icons?.[index]} />
                </li>
              ))}
            </ul>
          ) : null}
        </FadeIn>
      </div>
    </section>
  );
}

/**
 * Two characters rather than one: half the seeded tools share an initial
 * (Figma/Framer, Claude/ChatGPT), and a row of repeated letters reads as a
 * bug rather than as a placeholder.
 */
function placeholderMark(name: string | null): string {
  if (!name) return "";
  return name.slice(0, 2).replace(/^./, (c) => c.toUpperCase());
}

function ToolChip({ tool, icon }: { tool: Tool; icon?: React.ReactNode }) {
  const inner = (
    <>
      <span
        aria-hidden="true"
        className="flex size-6 items-center justify-center"
      >
        {icon ?? (
          <span className="text-ink text-sm font-semibold">
            {placeholderMark(tool.name)}
          </span>
        )}
      </span>
      <span className="sr-only">{tool.name}</span>
    </>
  );

  const surface =
    "bg-bg-raised shadow-raised rounded-chip ring-line/70 flex size-14 " +
    "items-center justify-center ring-1 transition-transform duration-[--dur-base]";

  if (!tool.url) {
    return <span className={surface}>{inner}</span>;
  }

  return (
    <a
      href={tool.url}
      target="_blank"
      rel="noopener noreferrer"
      title={tool.name ?? undefined}
      className={`${surface} hover:-translate-y-0.5`}
    >
      {inner}
    </a>
  );
}
