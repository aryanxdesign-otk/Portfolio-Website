import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { PortableTextRenderer } from "@/components/portable-text/PortableTextRenderer";
import { BackLink } from "@/components/ui/BackLink";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { InteractionStage } from "@/components/ui/InteractionStage";
import { MetaRow } from "@/components/ui/MetaRow";
import { formatDate } from "@/lib/date";
import { getHighlightedSource } from "@/lib/highlight";
import { INTERACTIONS, type InteractionKey } from "@/interactions/registry";
import { getInteraction, getInteractionSlugs } from "@/sanity/lib/content";

export async function generateStaticParams() {
  const slugs = await getInteractionSlugs();
  return slugs.filter(Boolean).map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/interactions/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const item = await getInteraction(slug);
  if (!item) return { title: "Not found" };

  return {
    title: item.seo?.title ?? item.title ?? "Interaction",
    description: item.seo?.description ?? item.summary ?? undefined,
    robots: item.seo?.noIndex ? { index: false, follow: false } : undefined,
  };
}

async function InteractionBody({
  params,
}: Pick<PageProps<"/interactions/[slug]">, "params">) {
  const { slug } = await params;
  const item = await getInteraction(slug);
  if (!item) notFound();

  // Read and highlight the real source at build time, so the code on the page
  // is always the code that is running.
  const entry = INTERACTIONS[item.componentKey as InteractionKey];
  const source = entry ? await getHighlightedSource(entry.sourcePath) : null;

  return (
    <>
      <BackLink href="/interactions">Interactions</BackLink>

      <h1 className="mt-8 max-w-[20ch] text-2xl font-medium tracking-tight text-balance">
        {item.title}
      </h1>

      {item.summary ? (
        <p className="text-ink-muted mt-4 max-w-[56ch] leading-relaxed">
          {item.summary}
        </p>
      ) : null}

      <MetaRow
        items={[
          { label: "Date", value: formatDate(item.date) },
          { label: "Tags", value: item.tags?.join(", ") },
        ]}
      />

      <div className="mt-12">
        <InteractionStage componentKey={item.componentKey} minHeight="18rem" />
      </div>

      {item.notes && item.notes.length > 0 ? (
        <div className="text-ink-muted mt-12 max-w-[62ch] space-y-4 leading-[1.7]">
          <PortableTextRenderer value={item.notes} />
        </div>
      ) : null}

      {source ? (
        <section aria-labelledby="source" className="mt-14">
          <h2
            id="source"
            className="text-ink-faint mb-3 font-mono text-xs tracking-widest uppercase"
          >
            {item.sourceLabel ?? "Source"}
          </h2>
          <CodeBlock
            html={source.html}
            raw={source.raw}
            filename={source.filename}
          />
        </section>
      ) : null}
    </>
  );
}

export default function InteractionPage(
  props: PageProps<"/interactions/[slug]">,
) {
  return (
    <main
      id="main"
      className="flex-1 px-6 pt-12 pb-(--space-section) md:px-8 md:pt-16"
    >
      <div className="mx-auto max-w-3xl">
        <Suspense fallback={<div className="h-screen" />}>
          <InteractionBody params={props.params} />
        </Suspense>
      </div>
    </main>
  );
}
