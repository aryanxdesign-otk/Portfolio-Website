/**
 * Placeholder home page. Replaced in Phase 4 once the site structure is
 * confirmed; exists now to prove the token system and deploy pipeline.
 */
export default function Home() {
  return (
    <main id="main" className="container-page py-section flex-1">
      <p className="text-ink-faint font-mono text-xs tracking-widest uppercase">
        Phase 0 · scaffold
      </p>
      <h1 className="mt-6 max-w-[14ch] text-4xl font-medium">
        Portfolio rebuild in progress.
      </h1>
      <p className="text-ink-muted mt-6 max-w-[48ch] text-lg">
        Design tokens, motion primitives and the Sanity content model are being
        wired up. Content editing lives at{" "}
        <code className="bg-bg-inset rounded px-1.5 py-0.5 font-mono text-sm">
          /studio
        </code>
        .
      </p>
    </main>
  );
}
