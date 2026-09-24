import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { PortableTextRenderer } from "@/components/portable-text/PortableTextRenderer";
import { BackLink } from "@/components/ui/BackLink";
import { GalleryGrid } from "@/components/ui/GalleryGrid";
import { MetaRow } from "@/components/ui/MetaRow";
import { formatDate } from "@/lib/date";
import { getVisualProject, getVisualProjectSlugs } from "@/sanity/lib/content";

export async function generateStaticParams() {
  const slugs = await getVisualProjectSlugs();
  return slugs.filter(Boolean).map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/visual/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const project = await getVisualProject(slug);
  if (!project) return { title: "Not found" };

  return {
    title: project.seo?.title ?? project.title ?? "Visual project",
    description: project.seo?.description ?? project.summary ?? undefined,
    robots: project.seo?.noIndex ? { index: false, follow: false } : undefined,
  };
}

async function VisualBody({
  params,
}: Pick<PageProps<"/visual/[slug]">, "params">) {
  const { slug } = await params;
  const project = await getVisualProject(slug);
  if (!project) notFound();

  return (
    <>
      <BackLink href="/visual">Visual &amp; brand</BackLink>

      <h1 className="mt-8 max-w-[20ch] text-2xl font-medium tracking-tight text-balance">
        {project.title}
      </h1>

      {project.summary ? (
        <p className="text-ink-muted mt-4 max-w-[56ch] leading-relaxed">
          {project.summary}
        </p>
      ) : null}

      <MetaRow
        items={[
          { label: "Client", value: project.client },
          { label: "Date", value: formatDate(project.date) },
          { label: "Type", value: project.projectType },
        ]}
      />

      {project.writing && project.writing.length > 0 ? (
        <div className="text-ink-muted mt-12 max-w-[62ch] space-y-4 leading-[1.7]">
          <PortableTextRenderer value={project.writing} />
        </div>
      ) : null}

      <GalleryGrid items={(project.gallery ?? []) as never} />
    </>
  );
}

export default function VisualProjectPage(props: PageProps<"/visual/[slug]">) {
  return (
    <main
      id="main"
      className="flex-1 px-6 pt-12 pb-(--space-section) md:px-8 md:pt-16"
    >
      <div className="mx-auto max-w-4xl">
        <Suspense fallback={<div className="h-screen" />}>
          <VisualBody params={props.params} />
        </Suspense>
      </div>
    </main>
  );
}
