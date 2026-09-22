import { StatusDot } from "./StatusDot";

/**
 * The outlined availability chip from the reference: dot, then a small
 * uppercase mono label.
 */
export function AvailabilityPill({
  label,
  tone = "positive",
}: {
  label: string;
  tone?: "positive" | "muted";
}) {
  return (
    <p className="border-line text-ink-muted inline-flex items-center gap-2 rounded-full border py-1.5 pr-4 pl-3 font-mono text-xs tracking-[0.12em] uppercase">
      <StatusDot tone={tone} />
      {label}
    </p>
  );
}
