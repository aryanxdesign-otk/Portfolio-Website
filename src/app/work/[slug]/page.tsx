import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { PortableTextRenderer } from "@/components/portable-text/PortableTextRenderer";
import { Container } from "@/components/ui/Container";
import { SanityImage } from "@/components/ui/SanityImage";
import { getCaseStudy, getCaseStudySlugs } from "@/sanity/lib/content";

export async function generateStaticParams() {
  const slugs = await getCaseStudySlugs();
  return slugs.filter(Boolean).map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/work/[slug]">,
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
 * The params read lives inside the Suspense boundary below, not above it.
 * Awaiting params at the page level would tie this route's prerendered App
 * Shell to a single URL, so projects added after the last build would lose
 * the instant shell.
 */
async function CaseStudyBody({
  params,
}: Pick<PageProps<"/work/[slug]">, "params">) {
  const { slug } = await params;
  const project = await getCaseStudy(slug);

  if (!project) notFound();

  const meta = [
    project.client,
    project.roles?.join(", "),
    project.timeline,
    project.year ? String(project.year) : null,
  ].filter(Boolean);

  return (
    <>
      <Link
        href="/work"
        className="text-ink-muted hover:text-ink text-sm transition-colors"
      >
        ← Work
      </Link>

      <h1 className="mt-8 max-w-[22ch] text-2xl font-medium">
        {project.title}
      </h1>

      {project.summary ? (
        <p className="text-ink-muted mt-4 max-w-[60ch] leading-[1.7]">
          {project.summary}
        </p>
      ) : null}

      {meta.length > 0 ? (
        <dl className="border-line text-ink-muted mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t pt-6 font-mono text-xs">
          {project.client ? (
            <Meta label="Client" value={project.client} />
          ) : null}
          {project.roles?.length ? (
            <Meta label="Role" value={project.roles.join(", ")} />
          ) : null}
          {project.timeline ? (
            <Meta label="Timeline" value={project.timeline} />
          ) : null}
          {project.year ? (
            <Meta label="Year" value={String(project.year)} />
          ) : null}
        </dl>
      ) : null}

      {project.externalUrl ? (
        <a
          href={project.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-ink decoration-line hover:decoration-ink mt-6 inline-block text-sm underline underline-offset-[3px] transition-colors"
        >
          Visit site ↗
        </a>
      ) : null}

      {project.coverImage?.asset ? (
        <div className="bg-bg-inset mt-12 overflow-hidden rounded-(--radius)">
          <SanityImage
            image={project.coverImage}
            priority
            sizes="(max-width: 768px) 100vw, 40rem"
            className="w-full"
          />
        </div>
      ) : null}

      <div className="mt-12">
        <PortableTextRenderer value={project.body} />
      </div>

      {project.next?.slug ? (
        <nav className="border-line mt-20 border-t pt-6">
          <Link
            href={`/work/${project.next.slug}` as never}
            className="group block"
          >
            <span className="text-ink-faint font-mono text-xs tracking-widest uppercase">
              Next project
            </span>
            <span className="text-ink group-hover:text-ink-muted mt-1 block font-medium transition-colors">
              {project.next.title} →
            </span>
          </Link>
        </nav>
      ) : null}
    </>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-ink-faint">{label}</dt>
      <dd className="text-ink-muted mt-0.5">{value}</dd>
    </div>
  );
}

export default function CaseStudyPage(props: PageProps<"/work/[slug]">) {
  return (
    <main id="main" className="flex-1">
      <Container className="pt-8 pb-(--space-section) md:pt-14">
        <Suspense fallback={<div className="h-96" />}>
          <CaseStudyBody params={props.params} />
        </Suspense>
      </Container>
    </main>
  );
}
