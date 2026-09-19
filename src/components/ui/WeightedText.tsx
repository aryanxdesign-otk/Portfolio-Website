import { PortableText, type PortableTextComponents } from "@portabletext/react";

import { cn } from "@/lib/cn";

/**
 * The alternating-weight paragraph used in the hero and the about block.
 *
 * Unbolded text is grey and bolded text is solid black, so emphasis mid-
 * sentence reads as rhythm rather than as shouting. That inversion is the
 * whole component: the default run is the quiet one.
 *
 * Takes the same structural `value` type as PortableTextRenderer, for the
 * reason documented there — typegen emits nullable markDefs where the library
 * expects them optional.
 */
const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
  },
  marks: {
    strong: ({ children }) => (
      <strong className="text-ink font-medium">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => {
      const href = typeof value?.href === "string" ? value.href : "#";
      const external = /^https?:/i.test(href);
      return (
        <a
          href={href}
          className="text-ink decoration-line hover:decoration-ink underline underline-offset-[3px] transition-colors"
          {...(external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {children}
        </a>
      );
    },
  },
};

export function WeightedText({
  value,
  className,
}: {
  value: readonly { _type: string; _key: string }[] | null | undefined;
  className?: string;
}) {
  if (!value || value.length === 0) return null;

  return (
    <div className={cn("text-ink-muted space-y-5 leading-[1.65]", className)}>
      <PortableText
        value={value as React.ComponentProps<typeof PortableText>["value"]}
        components={components}
      />
    </div>
  );
}
