import { FadeIn } from "@/components/motion/FadeIn";
import {
  WorkHistory,
  type WorkHistoryItem,
} from "@/components/sections/WorkHistory";
import { SocialLinks, type Social } from "@/components/ui/SocialLinks";
import { TwoTone, type TwoToneHeading } from "@/components/ui/TwoTone";
import { WeightedText } from "@/components/ui/WeightedText";

/**
 * The about block: portrait and work history on the left, the long-form bio
 * and signature on the right, under a full-width two-tone heading.
 */
export function AboutBlock({
  heading,
  name,
  roles,
  bio,
  portrait,
  signature,
  socials,
  experiences,
}: {
  heading: TwoToneHeading;
  name: string;
  roles: string[];
  bio: readonly { _type: string; _key: string }[] | null | undefined;
  /** Server-rendered portrait, or a placeholder. */
  portrait: React.ReactNode;
  /** Server-rendered signature image, if one is set. */
  signature?: React.ReactNode;
  socials: Social[];
  experiences: WorkHistoryItem[];
}) {
  return (
    <section
      aria-labelledby="about"
      className="border-line relative z-10 border-t py-(--space-section)"
    >
      <div className="container-page">
        <FadeIn y={16}>
          <TwoTone
            heading={heading}
            id="about"
            stack
            className="text-display-sm max-w-[44ch]"
          />
        </FadeIn>

        <div className="mt-14 grid gap-12 md:mt-20 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] md:gap-16">
          <FadeIn y={16}>
            <div className="relative">
              <div className="rounded-card bg-bg-inset aspect-[4/5] overflow-hidden">
                {portrait}
              </div>
              {socials.length > 0 ? (
                <SocialLinks
                  socials={socials}
                  className="absolute right-3 bottom-3 left-3 justify-end"
                />
              ) : null}
            </div>

            <p className="text-ink mt-5 text-lg font-semibold tracking-tight">
              {name}
            </p>
            {roles.length > 0 ? (
              <p className="text-ink-muted mt-1 flex flex-wrap items-center gap-x-2 text-sm">
                {roles.map((role, index) => (
                  <span key={role} className="flex items-center gap-2">
                    {index > 0 ? (
                      <span aria-hidden="true" className="text-ink-faint">
                        ✦
                      </span>
                    ) : null}
                    {role}
                  </span>
                ))}
              </p>
            ) : null}

            <div className="mt-10">
              <WorkHistory items={experiences} />
            </div>
          </FadeIn>

          <FadeIn y={16} delay={0.08}>
            <WeightedText value={bio} className="md:text-md text-base" />
            {signature ? <div className="mt-10 w-40">{signature}</div> : null}
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
