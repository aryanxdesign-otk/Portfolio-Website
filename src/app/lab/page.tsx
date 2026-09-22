import type { Metadata } from "next";

import { SanityImage } from "@/components/ui/SanityImage";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import { FadeIn } from "@/components/motion/FadeIn";
import { getShots } from "@/sanity/lib/content";

export const metadata: Metadata = {
  title: "Lab",
  description: "Experiments, interface explorations and loose ends.",
};

export default async function LabPage() {
  const shots = await getShots();

  return (
    <main id="main" className="flex-1 px-6 md:px-8">
      <div className="pt-12 pb-(--space-section) md:pt-20">
        <h1 className="text-xl font-medium tracking-tight">Lab</h1>
        <p className="text-ink-muted mt-3 max-w-[52ch] text-sm leading-relaxed">
          Experiments and interface explorations. Unfinished by design.
        </p>

        {shots.length === 0 ? (
          <p className="text-ink-muted mt-12 text-sm">Nothing here yet.</p>
        ) : (
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {shots.map((shot, index) => (
              <FadeIn as="li" key={shot._id} y={16} delay={(index % 3) * 0.06}>
                <figure>
                  <div
                    className="bg-bg-subtle border-line overflow-hidden rounded-(--radius-card) border"
                    style={{ aspectRatio: shot.aspectRatio ?? "1/1" }}
                  >
                    {shot.mediaType === "video" && shot.videoUrl ? (
                      <VideoPlayer
                        src={shot.videoUrl}
                        poster={shot.videoPoster?.asset?.url ?? undefined}
                        ariaLabel={shot.title ?? undefined}
                      />
                    ) : (
                      <SanityImage
                        image={shot.image}
                        fill={false}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <figcaption className="text-ink-muted mt-2.5 text-sm">
                    {shot.title}
                  </figcaption>
                </figure>
              </FadeIn>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
