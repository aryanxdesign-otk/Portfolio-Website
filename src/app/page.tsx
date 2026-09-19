import { AboutBlock } from "@/components/sections/AboutBlock";
import { Hero } from "@/components/sections/Hero";
import { LogoMarquee } from "@/components/sections/LogoMarquee";
import {
  ProjectShowcase,
  type ShowcaseProject,
} from "@/components/sections/ProjectShowcase";
import { Tools } from "@/components/sections/Tools";
import type { WorkHistoryItem } from "@/components/sections/WorkHistory";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { SanityImage } from "@/components/ui/SanityImage";
import {
  getAbout,
  getCaseStudies,
  getExperiences,
  getHomePage,
  getSiteSettings,
} from "@/sanity/lib/content";

/** "2023 — 2025", "2026 — Present", or just "2026" for a single year. */
function formatRange(
  start?: string | null,
  end?: string | null,
  isCurrent?: boolean | null,
): string {
  const year = (value?: string | null) => value?.slice(0, 4) ?? "";
  const from = year(start);
  const to = isCurrent ? "Present" : year(end);
  if (!from) return to;
  return from === to ? from : `${from} — ${to}`;
}

/** The grid is built for four; the rest live on the work index. */
const FEATURED_LIMIT = 4;

export default async function Home() {
  const [home, about, caseStudies, experiences, settings] = await Promise.all([
    getHomePage(),
    getAbout(),
    getCaseStudies(),
    getExperiences(),
    getSiteSettings(),
  ]);

  // Explicit featured list if the editor set one, otherwise the newest work.
  const source = home?.featured?.length ? home.featured : caseStudies;
  const featured = source.slice(0, FEATURED_LIMIT);

  const projects: ShowcaseProject[] = featured.map((project) => ({
    id: project._id,
    title: project.title ?? "",
    meta: project.roles?.length ? project.roles.join("  |  ") : null,
    href: project.slug ? `/work/${project.slug}` : null,
  }));

  const media = featured.map((project) =>
    project.coverImage ? (
      <SanityImage
        key={project._id}
        image={project.coverImage}
        alt={project.coverImage.alt ?? project.title ?? ""}
        fill
        sizes="(min-width: 640px) 45vw, 90vw"
        className="h-full w-full object-cover"
      />
    ) : (
      <MediaPlaceholder key={project._id} label={project.title} />
    ),
  );

  const clients = home?.clients ?? [];
  const tools = home?.tools ?? [];

  const history: WorkHistoryItem[] = experiences.map((item) => ({
    id: item._id,
    company: item.company ?? "",
    role: item.role ?? null,
    range: formatRange(item.startDate, item.endDate, item.isCurrent),
  }));

  const showStatus =
    settings?.availabilityStatus && settings.availabilityStatus !== "hidden";

  return (
    <main id="main" className="relative z-10 flex-1">
      <Hero
        heading={home?.heroHeading ?? null}
        subline={home?.heroSubline}
        primaryCta={home?.heroPrimaryCta}
        videoUrl={home?.heroVideoUrl}
        availabilityNote={
          showStatus
            ? (settings.availabilityNote ?? "Available for work")
            : null
        }
        availabilityTone={
          settings?.availabilityStatus === "unavailable" ? "muted" : "positive"
        }
      />

      {clients.length > 0 ? (
        <section aria-label="Clients" className="border-line border-t py-9">
          <div className="container-page">
            <LogoMarquee
              logos={clients}
              media={clients.map((client) =>
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
          </div>
        </section>
      ) : null}

      <ProjectShowcase
        heading={home?.workSectionHeading ?? "Latest Projects"}
        allLabel={home?.workAllLabel}
        allHref="/work"
        projects={projects}
        media={media}
      />

      <Tools
        heading={home?.toolsHeading ?? null}
        note={home?.toolsNote}
        tools={tools}
        icons={tools.map((tool) =>
          tool.icon ? (
            <SanityImage
              key={tool.name}
              image={tool.icon}
              alt=""
              width={24}
              height={24}
              className="size-6 object-contain"
            />
          ) : null,
        )}
      />

      <AboutBlock
        heading={home?.aboutHeading ?? null}
        name={settings?.name ?? ""}
        roles={about?.skills ?? []}
        bio={about?.bio}
        portrait={
          about?.portrait ? (
            <SanityImage
              image={about.portrait}
              alt={about.portrait.alt ?? settings?.name ?? ""}
              fill
              sizes="(min-width: 768px) 30vw, 90vw"
              className="h-full w-full object-cover"
            />
          ) : (
            <MediaPlaceholder label="Portrait" />
          )
        }
        signature={
          about?.signature ? (
            <SanityImage
              image={about.signature}
              alt=""
              width={160}
              height={64}
              className="h-auto w-full object-contain"
            />
          ) : null
        }
        socials={settings?.socials ?? []}
        experiences={history}
      />
    </main>
  );
}
