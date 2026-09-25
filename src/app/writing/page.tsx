import type { Metadata } from "next";

import { FadeIn } from "@/components/motion/FadeIn";
import { ListRow } from "@/components/ui/ListRow";
import { PageHeader } from "@/components/ui/PageHeader";
import { formatDate } from "@/lib/date";
import { getPosts } from "@/sanity/lib/content";

export const metadata: Metadata = {
  title: "Writing",
  description: "Notes on design, craft and the things I build.",
};

export default async function WritingIndex() {
  const posts = await getPosts();

  return (
    <main
      id="main"
      className="flex-1 px-6 pt-12 pb-(--space-section) md:px-8 md:pt-16"
    >
      <div className="mx-auto max-w-3xl">
        <PageHeader
          title="Writing"
          description="Notes on design, craft and the things I build."
        />

        {posts.length === 0 ? (
          <p className="text-ink-muted mt-14 text-sm">Nothing published yet.</p>
        ) : (
          <FadeIn y={16} className="mt-12">
            <div>
              {posts.map((post) => (
                <ListRow
                  key={post._id}
                  title={post.title ?? ""}
                  description={post.excerpt}
                  meta={formatDate(post.publishedAt)}
                  href={post.slug ? `/writing/${post.slug}` : null}
                />
              ))}
            </div>
          </FadeIn>
        )}
      </div>
    </main>
  );
}
