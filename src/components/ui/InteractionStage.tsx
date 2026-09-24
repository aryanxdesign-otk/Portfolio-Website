"use client";

import { useState } from "react";

import { getInteraction } from "@/interactions/registry";

/**
 * Mounts a registered interaction on a neutral stage.
 *
 * The reset control remounts the component by changing its key — the cheapest
 * way to return a demo with internal state to its starting point, and more
 * honest than asking every interaction to implement its own reset.
 *
 * A key that resolves to nothing renders a visible notice rather than an empty
 * box, so a stale CMS entry is obvious instead of looking like a styling bug.
 */
export function InteractionStage({
  componentKey,
  minHeight = "16rem",
}: {
  componentKey: string | null | undefined;
  minHeight?: string;
}) {
  const [run, setRun] = useState(0);
  const entry = getInteraction(componentKey);

  if (!entry) {
    return (
      <div
        className="border-line bg-bg-subtle text-ink-muted grid place-items-center rounded-(--radius-card) border border-dashed p-8 text-center text-sm"
        style={{ minHeight }}
      >
        <p>
          No component is registered under{" "}
          <code className="font-mono">{componentKey ?? "—"}</code>.
        </p>
      </div>
    );
  }

  const { Component } = entry;

  return (
    <div className="border-line bg-bg-subtle relative overflow-hidden rounded-(--radius-card) border">
      <div className="grid place-items-center p-10" style={{ minHeight }}>
        <Component key={run} />
      </div>

      <button
        type="button"
        onClick={() => setRun((value) => value + 1)}
        className="text-ink-faint hover:text-ink absolute right-3 bottom-3 rounded-full px-2.5 py-1 font-mono text-xs transition-colors"
      >
        Reset
      </button>
    </div>
  );
}
