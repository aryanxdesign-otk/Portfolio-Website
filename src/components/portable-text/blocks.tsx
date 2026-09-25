import type { PortableTextComponents } from "@portabletext/react";
import Link from "next/link";

import { FadeIn } from "@/components/motion/FadeIn";
import { SanityImage } from "@/components/ui/SanityImage";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import { cn } from "@/lib/cn";
import type { SanityImageWithMeta } from "@/sanity/lib/image";

/**
 * Prose runs in a narrower column than imagery — the template's defining
 * rhythm. `inset` matches the text column, `full` is the wider image column
 * (the container), and `bleed` escapes to the viewport.
 */
const PROSE = "mx-auto max-w-[46rem]";

const widthClass = {
  inset: PROSE,
  full: "w-full",
  bleed: "relative left-1/2 w-screen -translate-x-1/2",
} as const;

type Width = keyof typeof widthClass;

/**
 * Shown where an image block exists but its image has not been uploaded.
 *
 * Rendering nothing would silently swallow the block, so an editor who adds
 * an image and forgets to attach one sees no sign of the mistake. A visible
 * frame is the more useful failure.
 */
function EmptyMedia({ label }: { label?: string | null }) {
  return (
    <div className="border-line bg-bg-subtle text-ink-faint grid aspect-[16/10] w-full place-items-center rounded-(--radius) border border-dashed text-sm">
      {label ?? "Image"}
    </div>
  );
}

function Figure({
  children,
  caption,
  width = "full",
  className,
}: {
  children: React.ReactNode;
  caption?: string | null;
  width?: Width;
  className?: string;
}) {
  return (
    <FadeIn className={cn("my-10 md:my-16", widthClass[width], className)}>
      <figure>
        {children}
        {caption ? (
          <figcaption className="text-ink-muted mt-3 text-sm">
            {caption}
          </figcaption>
        ) : null}
      </figure>
    </FadeIn>
  );
}

/**
 * Renderers for every custom block in the case study body schema.
 *
 * Kept in one file so that adding a block to the schema has exactly one
 * matching place to add its component — if these drift apart, Portable Text
 * silently renders nothing, which is the failure mode this guards against.
 */
export const portableTextComponents: PortableTextComponents = {
  types: {
    imageBlock: ({ value }) => {
      const image = value?.image as SanityImageWithMeta | undefined;
      const width = (value?.width ?? "full") as Width;

      if (!image?.asset) {
        return (
          <Figure width={width}>
            <EmptyMedia />
          </Figure>
        );
      }

      return (
        <Figure caption={image.caption} width={width}>
          <div
            className={cn(
              "overflow-hidden",
              value?.background && "bg-bg-inset p-6 md:p-12",
              width !== "bleed" && "rounded-(--radius)",
            )}
          >
            <SanityImage
              image={image}
              className={cn("w-full", width !== "bleed" && "rounded-[inherit]")}
              sizes={
                width === "inset"
                  ? "(max-width: 768px) 100vw, 68ch"
                  : "(max-width: 768px) 100vw, 1400px"
              }
            />
          </div>
        </Figure>
      );
    },

    imageGrid: ({ value }) => {
      // Entries can be null while a grid is still being filled in; reading
      // through them crashes the render, so they are normalised here.
      const images = (
        (value?.images ?? []) as (SanityImageWithMeta | null)[]
      ).filter((image) => image !== undefined);
      if (images.length === 0) return null;

      const gap = {
        tight: "gap-2",
        normal: "gap-4 md:gap-6",
        none: "gap-0",
      }[(value?.gap ?? "normal") as "tight" | "normal" | "none"];

      return (
        <FadeIn className="my-10 md:my-16">
          <div
            className={cn(
              "grid grid-cols-1 sm:grid-cols-2",
              images.length === 3 && "sm:grid-cols-3",
              gap,
            )}
          >
            {images.map((image, index) => (
              <figure key={image?.asset?._ref ?? index}>
                {image?.asset ? (
                  <SanityImage
                    image={image}
                    className="w-full rounded-(--radius)"
                    sizes={`(max-width: 640px) 100vw, ${Math.round(100 / images.length)}vw`}
                  />
                ) : (
                  <EmptyMedia />
                )}
                {image?.caption ? (
                  <figcaption className="text-ink-muted mt-2 text-sm">
                    {image.caption}
                  </figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        </FadeIn>
      );
    },

    videoBlock: ({ value }) => {
      const src = value?.videoUrl as string | undefined;
      if (!src) return null;
      const width = (value?.width ?? "full") as Width;
      const poster = value?.poster as SanityImageWithMeta | undefined;

      return (
        <Figure caption={value?.caption} width={width}>
          <div
            className={cn(
              "bg-bg-inset overflow-hidden",
              width !== "bleed" && "rounded-(--radius)",
            )}
          >
            <VideoPlayer
              src={src}
              poster={poster?.asset?.url ?? undefined}
              autoplay={value?.autoplay ?? true}
              ariaLabel={value?.alt}
            />
          </div>
        </Figure>
      );
    },

    pullQuote: ({ value }) => (
      <FadeIn className="my-14 md:my-24">
        <figure className="mx-auto max-w-[26ch] text-center">
          <blockquote className="text-2xl font-medium tracking-tight text-balance">
            &ldquo;{value?.quote}&rdquo;
          </blockquote>
          {value?.attribution ? (
            <figcaption className="text-ink-muted mt-6 text-sm">
              — {value.attribution}
            </figcaption>
          ) : null}
        </figure>
      </FadeIn>
    ),

    statRow: ({ value }) => {
      const stats = (value?.stats ?? []) as {
        value?: string;
        label?: string;
      }[];
      if (stats.length === 0) return null;

      return (
        <FadeIn className="my-14 md:my-20">
          <dl
            className={`${PROSE} border-line grid grid-cols-2 gap-8 border-y py-10 md:grid-cols-4 md:gap-4`}
          >
            {stats.map((stat, index) => (
              <div key={`${stat.value}-${index}`}>
                {/* Value before label visually, but dt/dd order is kept
                    correct for assistive tech via flex-col-reverse. */}
                <div className="flex flex-col-reverse gap-1">
                  <dt className="text-ink-muted text-sm text-balance">
                    {stat.label}
                  </dt>
                  <dd className="text-2xl font-medium tracking-tight">
                    {stat.value}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </FadeIn>
      );
    },

    figmaEmbed: ({ value }) => {
      if (!value?.url) return null;
      return (
        <Figure width="full">
          <div
            className="bg-bg-inset overflow-hidden rounded-(--radius)"
            style={{ aspectRatio: value.aspectRatio ?? "16/9" }}
          >
            <iframe
              src={`https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(value.url)}`}
              title={value.title ?? "Figma embed"}
              className="h-full w-full border-0"
              loading="lazy"
              allowFullScreen
            />
          </div>
        </Figure>
      );
    },

    spacer: ({ value }) => {
      const height = {
        sm: "h-8 md:h-12",
        md: "h-16 md:h-24",
        lg: "h-24 md:h-40",
      }[(value?.size ?? "md") as "sm" | "md" | "lg"];

      return (
        <div className={cn("flex items-center", height)} aria-hidden="true">
          {value?.rule ? <hr className="border-line w-full" /> : null}
        </div>
      );
    },
  },

  block: {
    // Small, bold, and sitting directly on the paragraph beneath, so the
    // heading reads as that paragraph's first line rather than as a section
    // break with air around it. Same column as the prose, or it would hang
    // out past the text it introduces.
    h2: ({ children }) => (
      <h2 className={`${PROSE} text-ink text-md mt-16 mb-1 font-medium`}>
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className={`${PROSE} text-ink mt-10 mb-1 font-medium`}>{children}</h3>
    ),
    lead: ({ children }) => (
      <p className={`${PROSE} text-ink mb-8 text-lg`}>{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote
        className={`${PROSE} border-line text-ink-muted my-8 border-l-2 pl-6 italic`}
      >
        {children}
      </blockquote>
    ),
    normal: ({ children }) => (
      <p className={`${PROSE} text-ink-muted mb-5 leading-[1.75]`}>
        {children}
      </p>
    ),
  },

  list: {
    bullet: ({ children }) => (
      <ul className={`${PROSE} text-ink-muted mb-6 list-disc space-y-2 pl-5`}>
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol
        className={`${PROSE} text-ink-muted mb-6 list-decimal space-y-2 pl-5`}
      >
        {children}
      </ol>
    ),
  },

  marks: {
    strong: ({ children }) => (
      <strong className="text-ink font-medium">{children}</strong>
    ),
    code: ({ children }) => (
      <code className="bg-bg-inset rounded px-1.5 py-0.5 font-mono text-[0.9em]">
        {children}
      </code>
    ),
    link: ({ children, value }) => {
      const href = (value?.href ?? "#") as string;
      const isInternal = href.startsWith("/");

      if (isInternal) {
        return (
          <Link
            href={href as never}
            className="decoration-ink-faint hover:decoration-ink underline underline-offset-4 transition-colors"
          >
            {children}
          </Link>
        );
      }

      return (
        <a
          href={href}
          className="decoration-ink-faint hover:decoration-ink underline underline-offset-4 transition-colors"
          {...(value?.newTab
            ? // noreferrer alongside noopener: without it the destination can
              // read where the click came from via document.referrer.
              { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {children}
        </a>
      );
    },
  },
};
