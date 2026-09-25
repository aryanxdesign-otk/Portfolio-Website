import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { PortableTextRenderer } from "@/components/portable-text/PortableTextRenderer";
import { BackLink } from "@/components/ui/BackLink";
import { MetaRow } from "@/components/ui/MetaRow";
import { SanityImage } from "@/components/ui/SanityImage";
import { formatDate } from "@/lib/date";
import { getPost, getPostSlugs } from "@/sanity/lib/content";

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.filter(Boolean).map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/writing/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getPost(slug);
  if (!post) return { title: "Not found" };

  return {
    title: post.seo?.title ?? post.title ?? "Writing",
    description: post.seo?.description ?? post.excerpt ?? undefined,
    robots: post.seo?.noIndex ? { index: false, follow: false } : undefined,
  };
}

async function PostBody({
  params,
}: Pick<PageProps<"/writing/[slug]">, "params">) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <>
      <BackLink href="/writing">Writing</BackLink>

      <h1 className="mt-8 max-w-[22ch] text-2xl font-medium tracking-tight text-balance">
        {post.title}
      </h1>

      {post.excerpt ? (
        <p className="text-ink-muted mt-4 max-w-[56ch] leading-relaxed">
          {post.excerpt}
        </p>
      ) : null}

      <MetaRow
        items={[
          { label: "Published", value: formatDate(post.publishedAt) },
          { label: "Tags", value: post.tags?.join(", ") },
        ]}
      />

      {post.coverImage?.asset ? (
        <div className="bg-bg-subtle border-line mt-12 overflow-hidden rounded-(--radius-card) border">
          <SanityImage
            image={post.coverImage}
            priority
            sizes="(max-width: 1024px) 100vw, 800px"
            className="w-full"
          />
        </div>
      ) : null}

      <div className="mt-12">
        <PortableTextRenderer value={post.body} />
      </div>
    </>
  );
}

export default function PostPage(props: PageProps<"/writing/[slug]">) {
  return (
    <main
      id="main"
      className="flex-1 px-6 pt-12 pb-(--space-section) md:px-8 md:pt-16"
    >
      <div className="mx-auto max-w-3xl">
        <Suspense fallback={<div className="h-screen" />}>
          <PostBody params={props.params} />
        </Suspense>
      </div>
    </main>
  );
}
