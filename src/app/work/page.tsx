import type { Metadata } from "next";
import { Suspense } from "react";

import { ListRow } from "@/components/ui/ListRow";
import { CategoryFilter } from "@/components/ui/CategoryFilter";
import { getCategory, isCategory } from "@/sanity/categories";
import { getCaseStudies } from "@/sanity/lib/content";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected projects, micro interactions and visual design.",
};

/**
 * The filter comes from searchParams, which is request-time data. It is read
 * inside a Suspense boundary so the rest of the page still prerenders into
 * the static shell rather than the whole route turning dynamic.
 */
async function WorkList({
  searchParams,
}: Pick<PageProps<"/work">, "searchParams">) {
  const params = await searchParams;
  const raw = Array.isArray(params.category)
    ? params.category[0]
    : params.category;
  const active = isCategory(raw) ? raw : null;

  const projects = await getCaseStudies();
  const filtered = active
    ? projects.filter((project) => project.category === active)
    : projects;

  const category = getCategory(active ?? undefined);

  return (
    <>
      <CategoryFilter active={active} />

      {filtered.length === 0 ? (
        <p className="text-ink-muted mt-10 text-sm">
          {category
            ? `No ${category.short} published yet.`
            : "No projects published yet."}
        </p>
      ) : (
        <div className="mt-6">
          {filtered.map((project) => (
            <ListRow
              key={project._id}
              title={project.title ?? ""}
              description={project.summary}
              meta={project.year ? String(project.year) : null}
              href={project.slug ? `/work/${project.slug}` : null}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default function WorkIndex(props: PageProps<"/work">) {
  return (
    <main id="main" className="flex-1 px-6 md:px-8">
      <div className="mx-auto max-w-3xl pt-12 pb-(--space-section) md:pt-20">
        <h1 className="mb-8 text-xl font-medium tracking-tight">Work</h1>
        <Suspense fallback={<div className="h-64" />}>
          <WorkList searchParams={props.searchParams} />
        </Suspense>
      </div>
    </main>
  );
}
