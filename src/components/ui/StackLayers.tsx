import { AbstractArt } from "./AbstractArt";

/**
 * Contents for the three cards in each deck.
 *
 * The front card carries the artwork — a 16:10 slot at the top with a thin
 * meta strip beneath. Swapping in a real screenshot later means replacing the
 * <AbstractArt /> node; the box around it does not change.
 *
 * The two behind stay near-plain. They are mostly occluded, and detail there
 * only competes with the front card for attention.
 */

function MetaStrip() {
  return (
    <div className="space-y-2 px-3.5 py-3">
      <div className="bg-ink/10 h-1.5 w-[45%] rounded-full" />
      <div className="bg-ink/[0.07] h-1.5 w-[28%] rounded-full" />
    </div>
  );
}

/** A back card: a quiet surface with a hint of structure. */
function BackCard({ tone = 0 }: { tone?: number }) {
  return (
    <div className="flex h-full flex-col">
      <div
        className="bg-ink/[0.04] flex-1"
        style={{ opacity: 1 - tone * 0.35 }}
      />
      <div className="space-y-2 px-3.5 py-3">
        <div className="bg-ink/[0.07] h-1.5 w-[38%] rounded-full" />
      </div>
    </div>
  );
}

/** The front card: artwork slot plus meta. */
function FrontCard({
  variant,
}: {
  variant: "case-studies" | "micro-interactions" | "brand";
}) {
  return (
    <div className="flex h-full flex-col">
      <AbstractArt variant={variant} className="aspect-auto flex-1" />
      <MetaStrip />
    </div>
  );
}

export const caseStudyLayers = [
  <BackCard key="c0" tone={1} />,
  <BackCard key="c1" tone={0} />,
  <FrontCard key="c2" variant="case-studies" />,
] as const;

export const microInteractionLayers = [
  <BackCard key="m0" tone={1} />,
  <BackCard key="m1" tone={0} />,
  <FrontCard key="m2" variant="micro-interactions" />,
] as const;

export const brandLayers = [
  <BackCard key="b0" tone={1} />,
  <BackCard key="b1" tone={0} />,
  <FrontCard key="b2" variant="brand" />,
] as const;
