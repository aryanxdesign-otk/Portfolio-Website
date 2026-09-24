import type { Metadata } from "next";
import Link from "next/link";

import { FadeIn } from "@/components/motion/FadeIn";
import { InteractionStage } from "@/components/ui/InteractionStage";
import { PageHeader } from "@/components/ui/PageHeader";
import { getCollection } from "@/sanity/categories";
import { getInteractions } from "@/sanity/lib/content";

const collection = getCollection("interactions");

export const metadata: Metadata = {
  title: collection.title,
  description: collection.description,
};

export default async function InteractionsIndex() {
  const interactions = await getInteractions();

  return (
    <main
      id="main"
      className="flex-1 px-6 pt-12 pb-(--space-section) md:px-8 md:pt-16"
    >
      <PageHeader
        title={collection.title}
        description={collection.description}
      />

      {interactions.length === 0 ? (
        <p className="text-ink-muted mt-14 text-sm">
          No interactions published yet.
        </p>
      ) : (
        <ul className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {interactions.map((item, index) => (
            <FadeIn as="li" key={item._id} y={18} delay={(index % 3) * 0.07}>
              {/* The live component, not a picture of it — on a page about
                  interaction craft the grid should already be playable. */}
              <InteractionStage
                componentKey={item.componentKey}
                minHeight="12rem"
              />

              <Link
                href={`/interactions/${item.slug}` as never}
                className="group mt-4 block"
              >
                <h3 className="text-ink font-medium">
                  {item.title}
                  <span
                    aria-hidden="true"
                    className="text-ink-faint group-hover:text-ink ml-1 inline-block transition-transform duration-300 ease-(--ease-out-expo) group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </h3>
                <p className="text-ink-muted mt-1 text-sm leading-relaxed">
                  {item.summary}
                </p>
              </Link>
            </FadeIn>
          ))}
        </ul>
      )}
    </main>
  );
}
