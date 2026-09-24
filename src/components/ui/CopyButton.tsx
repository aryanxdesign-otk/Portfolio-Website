"use client";

import { useState } from "react";

/**
 * Copies a string to the clipboard and confirms it briefly.
 *
 * The confirmation is announced via aria-live rather than colour alone, so
 * the feedback reaches someone who cannot see the label change.
 */
export function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard can be blocked by permissions or a non-secure context;
      // failing silently is better than a broken-looking button.
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="text-ink-faint hover:text-ink shrink-0 transition-colors"
    >
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}
