import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { env } from "@/lib/env";
import { getHomePage, getSiteSettings } from "@/sanity/lib/content";

import { ThemeScript } from "./theme-script";
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

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const name = settings?.name ?? "Portfolio";
  const description =
    settings?.defaultSeo?.description ??
    settings?.tagline ??
    "Selected work and writing.";

  return {
    metadataBase: new URL(env.siteUrl),
    title: {
      default: `${name} — ${settings?.tagline ?? "Portfolio"}`,
      template: `%s — ${name}`,
    },
    description,
    openGraph: { type: "website", siteName: name, description },
    twitter: { card: "summary_large_image" },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fcfcfc" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0d0c" },
  ],
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // Both reads are cached and tagged, so they join the static shell rather
  // than making every page dynamic.
  const [settings, home] = await Promise.all([
    getSiteSettings(),
    getHomePage(),
  ]);
  const name = settings?.name ?? "Portfolio";

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="bg-bg text-ink flex min-h-full flex-col">
        <a
          href="#main"
          className="bg-ink text-bg sr-only rounded px-4 py-2 focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50"
        >
          Skip to content
        </a>

        <SiteHeader name={name} navLinks={settings?.navLinks ?? []} />
        {children}
        <SiteFooter
          name={name}
          ctaHeading={home?.ctaHeading}
          email={settings?.email}
          socials={settings?.socials ?? []}
          footerNote={settings?.footerNote}
        />
      </body>
    </html>
  );
}
