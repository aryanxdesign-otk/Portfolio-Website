import { FadeIn } from "@/components/motion/FadeIn";
import { Container } from "@/components/ui/Container";
import { ListRow } from "@/components/ui/ListRow";
import { Prose } from "@/components/ui/Prose";
import { StatusDot } from "@/components/ui/StatusDot";
import {
  getAbout,
  getCaseStudies,
  getExperiences,
  getHomePage,
  getSiteSettings,
} from "@/sanity/lib/content";
import { seedAboutParagraphs } from "@/sanity/lib/seed";

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

/** A section with a small mono label, matching the text-led layout. */
function Block({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <section aria-labelledby={id} className="mt-14 md:mt-20">
      <h2
        id={id}
        className="text-ink-faint mb-2 font-mono text-xs tracking-widest uppercase"
      >
        {label}
      </h2>
      {children}
    </section>
  );
}

export default async function Home() {
  const [home, about, caseStudies, experiences, settings] = await Promise.all([
    getHomePage(),
    getAbout(),
    getCaseStudies(),
    getExperiences(),
    getSiteSettings(),
  ]);

  const showStatus =
    settings?.availabilityStatus && settings.availabilityStatus !== "hidden";

  return (
    <main id="main" className="flex-1">
      <Container className="pt-8 pb-(--space-section) md:pt-14">
        {/* Intro */}
        <FadeIn y={12}>
          {showStatus ? (
            <p className="text-ink-muted mb-6 flex items-center gap-2 font-mono text-xs">
              <StatusDot
                tone={
                  settings.availabilityStatus === "unavailable"
                    ? "muted"
                    : "positive"
                }
              />
              {settings.availabilityNote ?? "Available for work"}
            </p>
          ) : null}

          <h1 className="max-w-[20ch] text-2xl font-medium">
            {home?.heroHeadline}
          </h1>

          {home?.heroSubline ? (
            <Prose className="mt-5 max-w-[60ch]">
              <p>{home.heroSubline}</p>
            </Prose>
          ) : null}
        </FadeIn>

        {/* Experience — roles held */}
        {experiences.length > 0 ? (
          <Block label="Experience">
            <div>
              {experiences.map((item) => (
                <ListRow
                  key={item._id}
                  title={item.company ?? ""}
                  description={item.role}
                  meta={formatRange(
                    item.startDate,
                    item.endDate,
                    item.isCurrent,
                  )}
                  href={item.url}
                  external={Boolean(item.url)}
                />
              ))}
            </div>
          </Block>
        ) : null}

        {/* Projects */}
        {caseStudies.length > 0 ? (
          <Block label={home?.workSectionHeading ?? "Projects"}>
            <div>
              {caseStudies.map((project) => (
                <ListRow
                  key={project._id}
                  title={project.title ?? ""}
                  description={project.summary}
                  meta={project.year ? String(project.year) : null}
                  href={project.slug ? `/work/${project.slug}` : null}
                />
              ))}
            </div>
          </Block>
        ) : null}

        {/* About */}
        <Block label="About">
          <Prose className="max-w-[62ch]">
            {seedAboutParagraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </Prose>
        </Block>

        {/* Tools */}
        {about?.tools && about.tools.length > 0 ? (
          <Block label="Tools">
            <ul className="text-ink-muted flex flex-wrap gap-x-2 gap-y-1.5 text-sm">
              {about.tools.map((tool, index) => (
                <li key={tool} className="flex items-center gap-2">
                  {tool}
                  {index < (about.tools?.length ?? 0) - 1 ? (
                    <span aria-hidden="true" className="text-ink-faint">
                      ·
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          </Block>
        ) : null}
      </Container>
    </main>
  );
}
