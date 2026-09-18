"use client";

import dynamic from "next/dynamic";

import { isSanityConfigured } from "@/lib/env";

/**
 * `ssr: false` keeps the Studio out of the server render entirely. It is a
 * client application — prerendering it would only burn build time, and would
 * fail outright before a Sanity project exists.
 */
const StudioClient = dynamic(() => import("./StudioClient"), {
  ssr: false,
  loading: () => <Centered>Loading the Studio…</Centered>,
});

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-ink-muted flex min-h-dvh items-center justify-center p-8 text-center text-sm">
      <div className="max-w-md">{children}</div>
    </div>
  );
}

export function StudioLoader() {
  // Without a project ID the Studio throws an opaque "Configuration must
  // contain `projectId`". Say something useful instead.
  if (!isSanityConfigured) {
    return (
      <Centered>
        <p className="text-ink mb-3 text-base font-medium">
          Sanity is not configured yet
        </p>
        <p className="mb-4">
          Create a project at sanity.io/manage, then set{" "}
          <code className="bg-bg-inset rounded px-1 py-0.5 font-mono text-xs">
            NEXT_PUBLIC_SANITY_PROJECT_ID
          </code>{" "}
          and{" "}
          <code className="bg-bg-inset rounded px-1 py-0.5 font-mono text-xs">
            NEXT_PUBLIC_SANITY_DATASET
          </code>
          .
        </p>
        <p className="text-ink-faint text-xs">
          Locally: copy <code className="font-mono">.env.example</code> to{" "}
          <code className="font-mono">.env.local</code>. On Vercel: add them in
          Project Settings → Environment Variables, then redeploy.
        </p>
      </Centered>
    );
  }

  return <StudioClient />;
}
