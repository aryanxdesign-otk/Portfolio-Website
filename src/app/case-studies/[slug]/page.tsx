import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { PortableTextRenderer } from "@/components/portable-text/PortableTextRenderer";
import { BackLink } from "@/components/ui/BackLink";
import { MetaRow } from "@/components/ui/MetaRow";
import { SanityImage } from "@/components/ui/SanityImage";
import { formatDate } from "@/lib/date";
import { getCaseStudy, getCaseStudySlugs } from "@/sanity/lib/content";

export async function generateStaticParams() {
  const slugs = await getCaseStudySlugs();
  return slugs.filter(Boolean).map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/case-studies/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const project = await getCaseStudy(slug);
  if (!project) return { title: "Not found" };

  return {
    title: project.seo?.title ?? project.title ?? "Case study",
    description: project.seo?.description ?? project.summary ?? undefined,
    robots: project.seo?.noIndex ? { index: false, follow: false } : undefined,
  };
}

/**
 * The params read lives inside the Suspense boundary, not above it. Awaiting
 * params at the page level would tie this route's prerendered App Shell to a
 * single URL, so case studies added after the last build would lose it.
 */
async function CaseStudyBody({
  params,
}: Pick<PageProps<"/case-studies/[slug]">, "params">) {
  const { slug } = await params;
  const project = await getCaseStudy(slug);
  if (!project) notFound();

  return (
    <>
      <BackLink href="/case-studies">Case studies</BackLink>

      <h1 className="mt-8 max-w-[18ch] text-3xl font-medium tracking-tight text-balance">
        {project.title}
      </h1>

      {project.summary ? (
        <p className="text-ink-muted mt-5 max-w-[56ch] text-lg leading-relaxed">
          {project.summary}
        </p>
      ) : null}

      <MetaRow
        items={[
          { label: "Date", value: formatDate(project.date) },
          { label: "Role", value: project.roles?.join(", ") },
          { label: "Client", value: project.client },
          { label: "Timeline", value: project.timeline },
        ]}
      />

      {project.externalUrl ? (
        <a
          href={project.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-ink decoration-line hover:decoration-ink mt-8 inline-block text-sm underline underline-offset-4 transition-colors"
        >
          Visit site ↗
        </a>
      ) : null}

      {project.coverImage?.asset ? (
        <div className="bg-bg-subtle border-line mt-14 overflow-hidden rounded-(--radius-card) border">
          <SanityImage
            image={project.coverImage}
            priority
            sizes="(max-width: 1024px) 100vw, 1100px"
            className="w-full"
          />
        </div>
      ) : null}

      <div className="mt-16">
        <PortableTextRenderer value={project.body} />
      </div>

      {project.next?.slug ? (
        <nav className="border-line mt-24 border-t pt-6">
          <BackLink href={`/case-studies/${project.next.slug}`}>
            Next: {project.next.title}
          </BackLink>
        </nav>
      ) : null}
    </>
  );
}

export default function CaseStudyPage(
  props: PageProps<"/case-studies/[slug]">,
) {
  return (
    <main
      id="main"
      className="flex-1 px-6 pt-12 pb-(--space-section) md:px-8 md:pt-16"
    >
      <div className="mx-auto max-w-4xl">
        <Suspense fallback={<div className="h-screen" />}>
          <CaseStudyBody params={props.params} />
        </Suspense>
      </div>
    </main>
  );
}
