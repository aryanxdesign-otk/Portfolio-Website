import type { Metadata } from "next";

import { ListRow } from "@/components/ui/ListRow";
import { Prose } from "@/components/ui/Prose";
import { getAbout, getExperiences } from "@/sanity/lib/content";
import { seedAboutParagraphs } from "@/sanity/lib/seed";

export const metadata: Metadata = {
  title: "About",
  description: "Background, experience and the tools I work in.",
};

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

function Block({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <section aria-labelledby={id} className="mt-12">
      <h2
        id={id}
        className="text-ink-faint mb-3 font-mono text-xs tracking-widest uppercase"
      >
        {label}
      </h2>
      {children}
    </section>
  );
}

export default async function AboutPage() {
  const [about, experiences] = await Promise.all([
    getAbout(),
    getExperiences(),
  ]);

  return (
    <main id="main" className="flex-1 px-6 md:px-8">
      <div className="mx-auto max-w-3xl pt-12 pb-(--space-section) md:pt-20">
        <h1 className="max-w-[24ch] text-xl font-medium tracking-tight text-balance">
          {about?.headline}
        </h1>

        <Prose className="mt-8 max-w-[64ch]">
          {seedAboutParagraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
        </Prose>

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

        {about?.skills && about.skills.length > 0 ? (
          <Block label="What I do">
            <ul className="text-ink-muted flex flex-wrap gap-x-2 gap-y-1.5 text-sm">
              {about.skills.map((skill, index) => (
                <li key={skill} className="flex items-center gap-2">
                  {skill}
                  {index < (about.skills?.length ?? 0) - 1 ? (
                    <span aria-hidden="true" className="text-ink-faint">
                      ·
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          </Block>
        ) : null}

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
      </div>
    </main>
  );
}
