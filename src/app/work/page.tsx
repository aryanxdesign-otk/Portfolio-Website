import type { Metadata } from "next";

import { Container } from "@/components/ui/Container";
import { ListRow } from "@/components/ui/ListRow";
import { getCaseStudies } from "@/sanity/lib/content";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected projects and case studies.",
};

export default async function WorkIndex() {
  const projects = await getCaseStudies();

  return (
    <main id="main" className="flex-1">
      <Container className="pt-8 pb-(--space-section) md:pt-14">
        <h1 className="text-2xl font-medium">Work</h1>

        {projects.length === 0 ? (
          <p className="text-ink-muted mt-6 text-sm">
            No projects published yet.
          </p>
        ) : (
          <div className="mt-10">
            {projects.map((project) => (
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
      </Container>
    </main>
  );
}
