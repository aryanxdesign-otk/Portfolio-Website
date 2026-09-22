import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { env } from "@/lib/env";
import { getSiteSettings } from "@/sanity/lib/content";

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

/** "Aryan Chillal" -> "AC". Stands in for an avatar until one is uploaded. */
function toInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

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
    { media: "(prefers-color-scheme: light)", color: "#ededeb" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a09" },
  ],
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const settings = await getSiteSettings();
  const name = settings?.name ?? "Portfolio";

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="bg-page text-ink min-h-dvh">
        <a
          href="#main"
          className="bg-ink text-bg sr-only rounded px-4 py-2 focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50"
        >
          Skip to content
        </a>

        {/* The page sits on grey; everything else lives on this white card. */}
        <div className="mx-auto w-full max-w-(--container-max) p-3 md:p-6">
          <div className="bg-bg relative flex min-h-[calc(100dvh-3rem)] flex-col rounded-(--radius-frame) shadow-[0_1px_2px_rgba(0,0,0,0.04),0_24px_60px_-30px_rgba(0,0,0,0.18)]">
            <SiteHeader
              name={name}
              navLinks={settings?.navLinks ?? []}
              email={settings?.email}
              initials={toInitials(name)}
            />
            {children}
            <SiteFooter
              name={name}
              email={settings?.email}
              socials={settings?.socials ?? []}
              footerNote={settings?.footerNote}
            />
          </div>
        </div>
      </body>
    </html>
  );
}
