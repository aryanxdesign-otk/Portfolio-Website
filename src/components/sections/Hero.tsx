import { FadeIn } from "@/components/motion/FadeIn";
import { HERO_STACK_ANCHOR_ID } from "@/components/sections/ProjectShowcase";
import { ArrowRight, Button, PlayIcon } from "@/components/ui/Button";
import { StatusDot } from "@/components/ui/StatusDot";
import { TwoTone, type TwoToneHeading } from "@/components/ui/TwoTone";
import { WeightedText } from "@/components/ui/WeightedText";

export function Hero({
  heading,
  subline,
  primaryCta,
  videoUrl,
  availabilityNote,
  availabilityTone,
}: {
  heading: TwoToneHeading;
  subline: readonly { _type: string; _key: string }[] | null | undefined;
  primaryCta?: { label?: string | null; href?: string | null } | null;
  videoUrl?: string | null;
  availabilityNote?: string | null;
  availabilityTone?: "positive" | "muted";
}) {
  return (
    <section className="relative z-10 pt-28 pb-(--space-section) md:pt-36">
      <div className="container-page">
        <div className="grid items-center gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,0.78fr)] md:gap-8">
          <FadeIn y={16}>
            {availabilityNote ? (
              <p className="bg-bg-raised ring-line text-ink-subtle shadow-raised rounded-pill mb-8 inline-flex items-center gap-2 px-3.5 py-2 font-mono text-xs ring-1">
                <StatusDot tone={availabilityTone ?? "positive"} />
                {availabilityNote}
              </p>
            ) : null}

            <TwoTone
              heading={heading}
              as="h1"
              stack
              className="text-display-lg"
            />

            <WeightedText value={subline} className="mt-7 max-w-[52ch]" />

            {primaryCta?.label || videoUrl ? (
              <div className="mt-10 flex flex-wrap items-center gap-3">
                {primaryCta?.label ? (
                  <Button href={primaryCta.href} variant="solid">
                    {primaryCta.label}
                    <ArrowRight />
                  </Button>
                ) : null}

                {videoUrl ? (
                  <Button href={videoUrl} variant="outline">
                    <PlayIcon />
                    Watch Video
                  </Button>
                ) : null}
              </div>
            ) : null}
          </FadeIn>

          {/*
            The stack of project cards renders here, but the cards themselves
            belong to the grid further down the page — they are transformed up
            into this box rather than living in it. All this element does is
            reserve the space and tell the showcase where to aim.

            It is hidden from assistive tech and from the narrow layout, where
            there is no room for the stack and the cards stay in the grid.
          */}
          <div
            id={HERO_STACK_ANCHOR_ID}
            aria-hidden="true"
            className="pointer-events-none hidden aspect-[4/3] w-full md:block"
          />
        </div>
      </div>
    </section>
  );
}
