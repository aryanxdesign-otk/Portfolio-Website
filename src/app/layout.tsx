import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteNav } from "@/components/layout/SiteNav";
import { Cursor } from "@/components/motion/Cursor";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { ColumnRules } from "@/components/ui/ColumnRules";
import { SanityImage } from "@/components/ui/SanityImage";
import { env } from "@/lib/env";
import { getHomePage, getSiteSettings } from "@/sanity/lib/content";

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

// The site is light-only by design, so there is one theme colour rather than
// a pair keyed to the OS preference.
export const viewport: Viewport = {
  themeColor: "#f7f7f7",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // Both reads are cached and tagged, so they join the static shell rather
  // than making every page dynamic.
  const [settings, home] = await Promise.all([
    getSiteSettings(),
    getHomePage(),
  ]);

  const name = settings?.name ?? "Portfolio";
  const clients = home?.clients ?? [];

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="bg-bg text-ink flex min-h-full flex-col">
        <a
          href="#main"
          className="bg-ink text-bg sr-only rounded px-4 py-2 focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60]"
        >
          Skip to content
        </a>

        <ColumnRules />
        <SmoothScroll />
        <Cursor />

        <SiteNav name={name} navLinks={settings?.navLinks ?? []} />

        {children}

        <SiteFooter
          ctaHeading={home?.ctaHeading ?? null}
          wordmark={home?.footerWordmark}
          email={settings?.email}
          bookingUrl={settings?.bookingUrl}
          bookingLabel={settings?.bookingLabel}
          socials={settings?.socials ?? []}
          clients={clients}
          clientsLabel={home?.clientsLabel}
          clientLogos={clients.map((client) =>
            client.logo ? (
              <SanityImage
                key={client.name}
                image={client.logo}
                alt={client.name ?? ""}
                width={140}
                height={32}
                className="h-8 w-auto object-contain"
              />
            ) : null,
          )}
        />
      </body>
    </html>
  );
}
