import "server-only";

import { cacheLife } from "next/cache";
import { codeToHtml } from "shiki";

import { INTERACTION_SOURCES } from "@/interactions/sources.generated";

/**
 * Highlights an interaction's source.
 *
 * The source arrives from a generated module rather than a filesystem read.
 * Reading it with fs at build time worked, but Next could not statically
 * bound the path and traced the whole project into the serverless bundle.
 *
 * Highlighting happens at build time inside `use cache`, so the visitor gets
 * plain markup and **no highlighter JavaScript** — shipping Shiki to colour
 * text that never changes would cost hundreds of kilobytes for nothing.
 *
 * Dual themes emit CSS variables for both, so the block follows the site's
 * light/dark toggle without re-highlighting.
 */
export async function getHighlightedSource(sourcePath: string): Promise<{
  html: string;
  raw: string;
  filename: string;
} | null> {
  "use cache";
  cacheLife("max");

  // "src/interactions/spring-toggle/index.tsx" -> "spring-toggle"
  const key = sourcePath.split("/").at(-2) ?? "";
  const raw = INTERACTION_SOURCES[key];

  if (!raw) {
    console.error(`[highlight] no generated source for "${key}"`);
    return null;
  }

  const html = await codeToHtml(raw, {
    lang: "tsx",
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
    cssVariablePrefix: "--shiki-",
  });

  return { html, raw, filename: sourcePath.split("/").slice(-2).join("/") };
}
