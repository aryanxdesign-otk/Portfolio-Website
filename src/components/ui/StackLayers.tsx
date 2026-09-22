/**
 * Placeholder contents for the three stacked cards.
 *
 * Drawn in markup rather than shipped as images: no assets to wait on, they
 * respond to the theme, and they stay crisp at any size. Each category gets
 * its own visual language so the three cards do not read as one repeated
 * shape. Swap any layer for a real screenshot when the work is ready.
 */

const bar = "bg-ink/10 rounded-full";

function Chrome({ label }: { label: string }) {
  return (
    <div className="border-line flex items-center gap-1.5 border-b px-3 py-2">
      <span className="bg-ink/15 size-2 rounded-full" />
      <span className="bg-ink/10 size-2 rounded-full" />
      <span className="bg-ink/10 size-2 rounded-full" />
      <span className="text-ink-faint ml-1.5 font-mono text-[10px]">
        {label}
      </span>
    </div>
  );
}

/** Case studies — product UI fragments. */
export const caseStudyLayers = [
  <div key="c0" className="h-full">
    <Chrome label="overview" />
    <div className="space-y-2.5 p-3.5">
      <div className={`${bar} h-2 w-2/5`} />
      <div className="flex gap-2">
        <div className="bg-ink/5 h-20 flex-1 rounded" />
        <div className="bg-ink/5 h-20 flex-1 rounded" />
      </div>
    </div>
  </div>,
  <div key="c1" className="h-full">
    <Chrome label="engagement" />
    <div className="flex h-[7.5rem] items-end gap-1 p-3">
      {[40, 65, 30, 80, 55, 95, 45, 70, 35, 60].map((h, i) => (
        <div
          key={i}
          className="bg-ink/15 flex-1 rounded-sm"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  </div>,
  <div key="c2" className="h-full">
    <Chrome label="activity" />
    <div className="space-y-3 p-3.5">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="bg-ink/10 size-5 shrink-0 rounded-full" />
          <span className={`${bar} h-1.5 flex-1`} />
          <span className={`${bar} h-1.5 w-6 shrink-0`} />
        </div>
      ))}
    </div>
  </div>,
] as const;

/** Micro interactions — controls caught mid-transition. */
export const microInteractionLayers = [
  <div key="m0" className="flex h-full items-center justify-center gap-3">
    <span className="bg-ink/10 relative h-7 w-12 rounded-full">
      <span className="bg-ink/40 absolute top-1 left-1 size-5 rounded-full" />
    </span>
    <span className="bg-ink/10 relative h-7 w-12 rounded-full">
      <span className="bg-ink absolute top-1 right-1 size-5 rounded-full" />
    </span>
  </div>,
  <div key="m1" className="flex h-full flex-col justify-center gap-2 px-4">
    <div className={`${bar} h-1.5 w-full`} />
    <div className="bg-ink/10 h-1.5 w-full overflow-hidden rounded-full">
      <div className="bg-ink h-full w-2/3 rounded-full" />
    </div>
    <div className="mt-1 flex gap-1.5">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="bg-ink/15 size-1.5 rounded-full"
          style={{ opacity: 1 - i * 0.22 }}
        />
      ))}
    </div>
  </div>,
  <div key="m2" className="flex h-full items-center justify-center">
    <span className="bg-ink text-bg inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium">
      Drag
      <span className="bg-bg/30 h-3 w-px" />
      <span aria-hidden="true">⇢</span>
    </span>
  </div>,
] as const;

/** Visual & brand — type and colour specimens. */
export const brandLayers = [
  <div key="b0" className="flex h-full items-center justify-center gap-2 px-4">
    {["#16150f", "#12b33f", "#e6e6e2", "#9a9a92"].map((c) => (
      <span
        key={c}
        className="border-line size-9 rounded-full border"
        style={{ background: c }}
      />
    ))}
  </div>,
  <div key="b1" className="flex h-full flex-col justify-center px-4">
    <span className="text-ink text-3xl leading-none font-medium tracking-tight">
      Aa
    </span>
    <span className="text-ink-faint mt-1.5 font-mono text-[10px] tracking-widest uppercase">
      Geist · 400 500 600
    </span>
  </div>,
  <div key="b2" className="flex h-full items-center gap-3 px-4">
    <span className="bg-ink text-bg grid size-10 shrink-0 place-items-center rounded-lg text-sm font-semibold">
      A
    </span>
    <span className="space-y-1.5">
      <span className={`${bar} block h-1.5 w-20`} />
      <span className={`${bar} block h-1.5 w-14`} />
    </span>
  </div>,
] as const;
