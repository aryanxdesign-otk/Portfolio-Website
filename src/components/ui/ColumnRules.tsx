/**
 * The two vertical hairlines marking the content column, running the full
 * height of the viewport.
 *
 * Fixed rather than absolute: the rules are a property of the layout grid,
 * not of any one section, so they should not scroll or need to know how tall
 * the page is. Sits at z-0 with the page shell above it at z-10, which is
 * also what lets the black footer cover them.
 */
export function ColumnRules() {
  return (
    <div
      aria-hidden="true"
      className="column-rules pointer-events-none fixed inset-0 z-0"
    />
  );
}
