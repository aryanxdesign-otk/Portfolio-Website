import type { PortableTextComponents } from "@portabletext/react";
import Link from "next/link";

import { FadeIn } from "@/components/motion/FadeIn";
import { SanityImage } from "@/components/ui/SanityImage";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import { cn } from "@/lib/cn";
import type { SanityImageWithMeta } from "@/sanity/lib/image";

/** Maps the schema's width variants onto layout classes. */
const widthClass = {
  inset: "mx-auto max-w-[68ch]",
  full: "w-full",
  // Breaks out of the container to the full viewport width.
  bleed: "relative left-1/2 w-screen -translate-x-1/2",
} as const;

type Width = keyof typeof widthClass;

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
      if (!image?.asset) return null;
      const width = (value?.width ?? "full") as Width;

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
      const images = (value?.images ?? []) as SanityImageWithMeta[];
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
              <figure key={image.asset?._ref ?? index}>
                <SanityImage
                  image={image}
                  className="w-full rounded-(--radius)"
                  sizes={`(max-width: 640px) 100vw, ${Math.round(100 / images.length)}vw`}
                />
                {image.caption ? (
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
        <figure className="mx-auto max-w-[24ch] text-center">
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
          <dl className="border-line grid grid-cols-2 gap-8 border-y py-10 md:grid-cols-4 md:gap-4">
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
    h2: ({ children }) => (
      <FadeIn as="div" y={16}>
        <h2 className="mt-16 mb-4 text-xl font-medium tracking-tight md:mt-24">
          {children}
        </h2>
      </FadeIn>
    ),
    h3: ({ children }) => (
      <h3 className="mt-10 mb-3 text-lg font-medium tracking-tight">
        {children}
      </h3>
    ),
    lead: ({ children }) => (
      <p className="text-ink mb-8 max-w-[60ch] text-lg">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-line text-ink-muted my-8 border-l-2 pl-6 italic">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => (
      <p className="text-ink-muted mb-5 max-w-[68ch]">{children}</p>
    ),
  },

  list: {
    bullet: ({ children }) => (
      <ul className="text-ink-muted mb-6 max-w-[68ch] list-disc space-y-2 pl-5">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="text-ink-muted mb-6 max-w-[68ch] list-decimal space-y-2 pl-5">
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
