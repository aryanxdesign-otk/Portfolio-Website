import type { Metadata } from "next";

import { FadeIn } from "@/components/motion/FadeIn";
import { CollectionGrid, type GridItem } from "@/components/ui/CollectionGrid";
import { PageHeader } from "@/components/ui/PageHeader";
import { formatDate } from "@/lib/date";
import { getCollection } from "@/sanity/categories";
import { getVisualProjects } from "@/sanity/lib/content";

const collection = getCollection("visual");

export const metadata: Metadata = {
  title: collection.title,
  description: collection.description,
};

export default async function VisualIndex() {
  const projects = await getVisualProjects();

  const items: GridItem[] = projects.map((project) => ({
    id: project._id,
    title: project.title ?? "",
    href: `/visual/${project.slug}`,
    tags: [formatDate(project.date, "year"), project.projectType].filter(
      (tag): tag is string => Boolean(tag),
    ),
    cover: project.coverImage,
    artVariant: "brand",
  }));

  return (
    <main
      id="main"
      className="flex-1 px-6 pt-12 pb-(--space-section) md:px-8 md:pt-16"
    >
      <PageHeader
        title={collection.title}
        description={collection.description}
      />

      {items.length === 0 ? (
        <p className="text-ink-muted mt-14 text-sm">Nothing published yet.</p>
      ) : (
        <FadeIn y={18} className="mt-14">
          <CollectionGrid items={items} columns={2} />
        </FadeIn>
      )}
    </main>
  );
}
