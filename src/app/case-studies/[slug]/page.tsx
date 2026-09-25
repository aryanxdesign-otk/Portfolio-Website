import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { PortableTextRenderer } from "@/components/portable-text/PortableTextRenderer";
import { BackLink } from "@/components/ui/BackLink";
import { ProjectMeta } from "@/components/ui/ProjectMeta";
import { SanityImage } from "@/components/ui/SanityImage";
import { ScopeOfWork } from "@/components/ui/ScopeOfWork";
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
 * Prose sits in a narrower column than the imagery — text at `prose-column`,
 * images at the full container. That relationship is the template's most
 * distinctive rule, so it lives in one class here and in the Portable Text
 * width variants, nowhere else.
 */
const PROSE = "mx-auto max-w-[46rem]";

async function CaseStudyBody({
  params,
}: Pick<PageProps<"/case-studies/[slug]">, "params">) {
  const { slug } = await params;
  const project = await getCaseStudy(slug);
  if (!project) notFound();

  return (
    <>
      <div className={PROSE}>
        <BackLink href="/case-studies">Case studies</BackLink>

        <h1 className="mt-8 max-w-[20ch] text-3xl font-medium tracking-tight text-balance">
          {project.title}
        </h1>

        <ProjectMeta
          items={[
            { label: "Project", value: project.project },
            {
              label: "Year",
              value: project.year ? String(project.year) : null,
            },
          ]}
        />
      </div>

      {project.coverImage?.asset ? (
        <div className="bg-bg-subtle border-line mt-12 overflow-hidden rounded-(--radius-card) border">
          <SanityImage
            image={project.coverImage}
            priority
            sizes="(max-width: 1024px) 100vw, 1100px"
            className="w-full"
          />
        </div>
      ) : null}

      <div className={`${PROSE} mt-12`}>
        {project.intro ? (
          <p className="text-ink leading-[1.75] font-medium text-pretty">
            {project.intro}
          </p>
        ) : null}

        <ScopeOfWork items={project.scopeOfWork} />

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
      </div>

      {/* The rule that closes the header and opens the case study proper. */}
      <hr className="border-line mt-16 border-t" />

      <div className="mt-16">
        <PortableTextRenderer value={project.body} />
      </div>

      {project.next?.slug ? (
        <nav className={`${PROSE} border-line mt-24 border-t pt-6`}>
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
      {/* Container is the image width; prose narrows inside it. */}
      <div className="mx-auto max-w-[64rem]">
        <Suspense fallback={<div className="h-screen" />}>
          <CaseStudyBody params={props.params} />
        </Suspense>
      </div>
    </main>
  );
}
