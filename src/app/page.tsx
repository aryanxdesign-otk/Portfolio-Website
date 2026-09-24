import { FadeIn } from "@/components/motion/FadeIn";
import { AvailabilityPill } from "@/components/ui/AvailabilityPill";
import { StackCard } from "@/components/ui/StackCard";
import {
  brandLayers,
  caseStudyLayers,
  microInteractionLayers,
} from "@/components/ui/StackLayers";
import { COLLECTIONS } from "@/sanity/categories";
import {
  getCategoryCounts,
  getHomePage,
  getSiteSettings,
} from "@/sanity/lib/content";

const LAYERS = {
  "case-studies": caseStudyLayers,
  interactions: microInteractionLayers,
  visual: brandLayers,
} as const;

export default async function Home() {
  const [home, settings, counts] = await Promise.all([
    getHomePage(),
    getSiteSettings(),
    getCategoryCounts(),
  ]);

  const countFor = {
    "case-studies": counts?.caseStudies ?? 0,
    interactions: counts?.interactions ?? 0,
    visual: counts?.visual ?? 0,
  };

  const showStatus =
    settings?.availabilityStatus && settings.availabilityStatus !== "hidden";

  return (
    <main id="main" className="flex-1 px-6 md:px-8">
      {/* Hero */}
      <section className="pt-14 pb-16 md:pt-24 md:pb-24">
        <FadeIn y={14}>
          <h1 className="max-w-[24ch] text-2xl font-medium tracking-tight text-pretty md:max-w-[38ch]">
            {home?.heroSubline ?? home?.heroHeadline}
          </h1>

          {showStatus && settings.availabilityNote ? (
            <div className="mt-8">
              <AvailabilityPill
                label={settings.availabilityNote}
                tone={
                  settings.availabilityStatus === "unavailable"
                    ? "muted"
                    : "positive"
                }
              />
            </div>
          ) : null}
        </FadeIn>
      </section>

      {/* The three work categories */}
      <section aria-labelledby="work-heading" className="pb-(--space-section)">
        <h2 id="work-heading" className="sr-only">
          {home?.workSectionHeading ?? "Work"}
        </h2>

        <div className="grid gap-14 md:grid-cols-3 md:gap-8">
          {COLLECTIONS.map((collection, index) => (
            <FadeIn key={collection.key} y={20} delay={index * 0.08}>
              <StackCard
                title={collection.title}
                description={collection.description}
                path={collection.key}
                count={countFor[collection.key]}
                href={collection.href}
                layers={
                  LAYERS[collection.key] as unknown as [
                    React.ReactNode,
                    React.ReactNode,
                    React.ReactNode,
                  ]
                }
              />
            </FadeIn>
          ))}
        </div>
      </section>
    </main>
  );
}
