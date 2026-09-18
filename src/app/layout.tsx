import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { env } from "@/lib/env";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// Static fallbacks. Per-route metadata (Phase 6) overrides these from the
// `seo` field on each document, falling back to siteSettings.
export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: {
    default: "Aryan — Portfolio",
    template: "%s — Aryan",
  },
  description: "Selected work, case studies and experiments.",
  openGraph: {
    type: "website",
    siteName: "Aryan",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fcfcfc" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0c0b" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="bg-bg text-ink flex min-h-full flex-col">
        <a
          href="#main"
          className="bg-ink text-bg focus:ring-ink sr-only rounded px-4 py-2 focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
