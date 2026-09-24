"use client";

import { motion } from "motion/react";
import { useState } from "react";

import { useReducedMotion } from "@/components/motion/useReducedMotion";

const TABS = ["Overview", "Activity", "Settings"];

/**
 * Tabs where the indicator travels between items instead of cutting.
 *
 * One element with a shared `layoutId` does the work: Motion measures the old
 * and new positions and interpolates. Fading one pill out while another fades
 * in costs the same code and loses the sense that it is the same object.
 */
export function ElasticTabs() {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();

  return (
    <div role="tablist" aria-label="Demo tabs" className="flex gap-1">
      {TABS.map((tab, index) => (
        <button
          key={tab}
          role="tab"
          type="button"
          aria-selected={active === index}
          onClick={() => setActive(index)}
          className={`relative rounded-full px-4 py-2 text-sm transition-colors ${
            active === index ? "text-bg" : "text-ink-muted hover:text-ink"
          }`}
        >
          {active === index ? (
            <motion.span
              layoutId="elastic-tabs-indicator"
              className="bg-ink absolute inset-0 rounded-full"
              transition={
                reduced
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 400, damping: 34 }
              }
            />
          ) : null}
          <span className="relative">{tab}</span>
        </button>
      ))}
    </div>
  );
}
