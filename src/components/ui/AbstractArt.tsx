import { cn } from "@/lib/cn";

/**
 * Stand-in artwork for the front card of each deck.
 *
 * Built from gradients and shapes rather than image files so there is nothing
 * to wait on, it follows the theme, and it stays crisp at any size. Each fills
 * the same 16:10 box a real screenshot will, so swapping one in later is a
 * straight replacement of this node — no layout to rework.
 */
export function AbstractArt({
  variant,
  className,
}: {
  variant: "case-studies" | "micro-interactions" | "brand";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-bg-subtle relative aspect-[16/10] w-full overflow-hidden",
        // `aspect-auto flex-1` from the front card overrides the ratio when
        // the slot is sized by its parent instead.
        className,
      )}
      aria-hidden="true"
    >
      {variant === "case-studies" ? <CaseStudyArt /> : null}
      {variant === "micro-interactions" ? <MicroArt /> : null}
      {variant === "brand" ? <BrandArt /> : null}
    </div>
  );
}

/** Overlapping planes, receding — a product surface seen side-on. */
function CaseStudyArt() {
  return (
    <>
      <div className="from-ink/[0.07] absolute inset-0 bg-gradient-to-br to-transparent" />
      <div className="border-ink/10 bg-bg/70 absolute top-[22%] left-[10%] h-[62%] w-[56%] -rotate-3 rounded-lg border shadow-sm" />
      <div className="border-ink/10 bg-bg/90 absolute top-[30%] left-[26%] h-[62%] w-[56%] rotate-2 rounded-lg border shadow-sm" />
      <div className="bg-ink/10 absolute top-[42%] left-[34%] h-1.5 w-[28%] rounded-full" />
      <div className="bg-ink/10 absolute top-[52%] left-[34%] h-1.5 w-[20%] rounded-full" />
    </>
  );
}

/** Concentric arcs — a gesture leaving a trail behind it. */
function MicroArt() {
  return (
    <>
      <div className="from-ink/[0.06] absolute inset-0 bg-gradient-to-tr to-transparent" />
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="border-ink/12 absolute rounded-full border"
          style={{
            inset: `${8 + i * 9}%`,
            opacity: 1 - i * 0.2,
          }}
        />
      ))}
      <div className="bg-ink absolute top-1/2 left-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full" />
    </>
  );
}

/** A colour field beside a type specimen. */
function BrandArt() {
  return (
    <>
      {/* Muted so this card carries the same weight as its neighbours — at
          full saturation it shouted next to them. */}
      <div className="absolute inset-0 grid grid-cols-5 opacity-[0.22]">
        {["#16150f", "#12b33f", "#6a6a63", "#c8c8c2", "#9a9a92"].map((c) => (
          <div key={c} style={{ background: c }} />
        ))}
      </div>
      <div className="bg-bg/90 absolute inset-x-[16%] top-1/2 flex h-[40%] -translate-y-1/2 items-center justify-center rounded-lg">
        <span className="text-ink text-2xl leading-none font-medium tracking-tight">
          Aa
        </span>
      </div>
    </>
  );
}
