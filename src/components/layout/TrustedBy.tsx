import { SanityImage } from "@/components/ui/SanityImage";
import type { SanityImageWithMeta } from "@/sanity/lib/image";

/**
 * The client strip above the footer.
 *
 * Falls back to setting the company name in type when no logo is uploaded, so
 * the strip is never a row of broken images while assets are still being
 * gathered. Muted by default and brought up on hover — the work is the point,
 * not the logos.
 */
export function TrustedBy({
  label = "Trusted by",
  clients,
}: {
  label?: string;
  clients: {
    name: string | null;
    url: string | null;
    logo: SanityImageWithMeta | null;
  }[];
}) {
  const visible = clients.filter((client) => client.name);
  if (visible.length === 0) return null;

  return (
    <section
      aria-label={label}
      className="border-line flex flex-wrap items-center gap-x-10 gap-y-5 border-t px-6 py-7 md:px-8"
    >
      <h2 className="text-ink-muted text-sm">{label}</h2>

      <ul className="flex flex-wrap items-center gap-x-10 gap-y-5">
        {visible.map((client) => {
          const mark = client.logo?.asset ? (
            <SanityImage
              image={client.logo}
              alt={client.name ?? ""}
              sizes="120px"
              className="h-5 w-auto object-contain"
            />
          ) : (
            <span className="text-ink text-base font-semibold tracking-tight">
              {client.name}
            </span>
          );

          return (
            <li
              key={client.name}
              className="opacity-45 transition-opacity duration-300 hover:opacity-100"
            >
              {client.url ? (
                <a href={client.url} target="_blank" rel="noopener noreferrer">
                  {mark}
                </a>
              ) : (
                mark
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
