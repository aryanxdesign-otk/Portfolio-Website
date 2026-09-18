import type { Metadata, Viewport } from "next";

import { StudioLoader } from "./StudioLoader";

/**
 * The Sanity Studio, mounted at /studio.
 *
 * The page is a static shell; the Studio boots on the client. Search engines
 * are kept out via robots.ts and the noindex below.
 */
export const metadata: Metadata = {
  title: "Studio",
  robots: { index: false, follow: false },
};

// The Studio manages its own full-viewport layout and needs the real viewport
// height on mobile, so it opts out of the page's normal scaling.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  interactiveWidget: "resizes-content",
};

export default function StudioPage() {
  return <StudioLoader />;
}
