import type { Metadata } from "next";
import { Suspense } from "react";

import { FadeIn } from "@/components/motion/FadeIn";
import { BackLink } from "@/components/ui/BackLink";
import { CategoryFilter } from "@/components/ui/CategoryFilter";
import { ProjectBlock } from "@/components/ui/ProjectBlock";
import {
  getCategory,
  isCategory,
  type CategoryValue,
} from "@/sanity/categories";
import { getCaseStudies } from "@/sanity/lib/content";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Case studies, front end micro interactions, visual design and brand.",
};

/**
 * The category view.
 *
 * The category comes from the URL rather than component state, so each
 * collection is a shareable page with its own title — reached from the home
 * page decks — while still being one route to maintain. Read inside a
 * Suspense boundary, since searchParams is request-time data and would
 * otherwise force the whole route dynamic.
 */
async function WorkGrid({
  searchParams,
}: Pick<PageProps<"/work">, "searchParams">) {
  const params = await searchParams;
  const raw = Array.isArray(params.category)
    ? params.category[0]
    : params.category;
  const active = isCategory(raw) ? raw : null;
  const category = getCategory(active ?? undefined);

  const projects = await getCaseStudies();
  const filtered = active
    ? projects.filter((project) => project.category === active)
    : projects;

  return (
    <>
      <header>
        <BackLink>Home</BackLink>

        <h1 className="mt-6 max-w-[20ch] text-2xl font-medium tracking-tight">
          {category?.title ?? "All work"}
        </h1>
        <p className="text-ink-muted mt-3 max-w-[56ch] leading-relaxed">
          {category?.description ??
            "Everything in one place — case studies, interactions and brand."}
        </p>

        <div className="mt-10">
          <CategoryFilter active={active} />
        </div>
      </header>

      {filtered.length === 0 ? (
        <p className="text-ink-muted mt-14 text-sm">
          {category
            ? `No ${category.short} published yet.`
            : "No projects published yet."}
        </p>
      ) : (
        <ul className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project, index) => (
            <FadeIn as="li" key={project._id} y={18} delay={(index % 3) * 0.07}>
              <ProjectBlock
                title={project.title ?? ""}
                summary={project.summary}
                year={project.year}
                slug={project.slug}
                cover={project.coverImage}
                category={(project.category ?? "case-studies") as CategoryValue}
                priority={index < 3}
              />
            </FadeIn>
          ))}
        </ul>
      )}
    </>
  );
}

export default function WorkIndex(props: PageProps<"/work">) {
  return (
    <main
      id="main"
      className="flex-1 px-6 pt-12 pb-(--space-section) md:px-8 md:pt-16"
    >
      <Suspense fallback={<div className="h-[32rem]" />}>
        <WorkGrid searchParams={props.searchParams} />
      </Suspense>
    </main>
  );
}
