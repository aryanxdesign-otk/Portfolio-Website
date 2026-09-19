"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useState } from "react";

import { useReducedMotion } from "@/components/motion/useReducedMotion";

export type WorkHistoryItem = {
  id: string;
  company: string;
  role: string | null;
  range: string;
};

/**
 * The work history stack.
 *
 * Collapsed, it shows the current role with the rest implied as layers
 * peeking out beneath it; expanding reveals the full list. The peeking layers
 * are decorative and aria-hidden — the count in the button is what actually
 * tells you how many more there are.
 */
export function WorkHistory({
  items,
  label = "My work history",
}: {
  items: WorkHistoryItem[];
  label?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const reduced = useReducedMotion();
  const listId = useId();

  if (items.length === 0) return null;

  const [first, ...rest] = items;
  const shown = expanded ? items : [first];

  return (
    <div>
      <p className="text-ink mb-4 text-base font-medium">{label}</p>

      <div className="relative">
        <ul id={listId} className="space-y-2">
          <AnimatePresence initial={false}>
            {shown.map((item) => (
              <motion.li
                key={item.id}
                layout={!reduced}
                initial={reduced ? false : { opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="bg-bg-raised shadow-raised ring-line/70 rounded-card relative z-10 flex items-center justify-between gap-4 px-4 py-3 ring-1"
              >
                <span>
                  <span className="text-ink block text-base font-medium">
                    {item.company}
                  </span>
                  {item.role ? (
                    <span className="text-ink-muted block text-sm">
                      {item.role}
                    </span>
                  ) : null}
                </span>
                <span className="text-ink-muted shrink-0 font-mono text-xs tabular-nums">
                  {item.range}
                </span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        {/* The implied depth of the collapsed stack. Purely decorative. */}
        {!expanded && rest.length > 0 ? (
          <div aria-hidden="true">
            <div className="bg-bg-raised ring-line/60 rounded-card absolute inset-x-3 -bottom-1.5 z-0 h-6 ring-1" />
            <div className="bg-bg-raised ring-line/40 rounded-card absolute inset-x-6 -bottom-3 z-0 h-6 ring-1" />
          </div>
        ) : null}
      </div>

      {rest.length > 0 ? (
        <div className="mt-7 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            aria-expanded={expanded}
            aria-controls={listId}
            className="bg-bg-raised shadow-raised ring-line/70 rounded-pill text-ink hover:bg-bg-inset inline-flex items-center gap-2 px-4 py-2 text-sm font-medium ring-1 transition-colors"
          >
            {expanded ? "Show less" : "Show all"}
            <span className="bg-ink text-ink-inverse flex size-4 items-center justify-center rounded-full font-mono text-[0.625rem] tabular-nums">
              {items.length}
            </span>
          </button>
        </div>
      ) : null}
    </div>
  );
}
