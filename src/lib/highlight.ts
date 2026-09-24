import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";

import { cacheLife } from "next/cache";
import { codeToHtml } from "shiki";

/**
 * Reads an interaction's source and highlights it.
 *
 * Both happen at build time inside a `use cache` scope, so the visitor gets
 * plain highlighted markup and **no highlighter JavaScript at all** — shipping
 * Shiki to the browser to colour text that never changes would be several
 * hundred kilobytes for nothing.
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

  const filename = sourcePath.split("/").slice(-2).join("/");

  let raw: string;
  try {
    // Resolved from the working directory, which is the repo root during a
    // build. next.config.ts traces these files so they exist at runtime too.
    raw = await readFile(path.join(process.cwd(), sourcePath), "utf8");
  } catch (error) {
    console.error(`[highlight] could not read ${sourcePath}`, error);
    return null;
  }

  const html = await codeToHtml(raw, {
    lang: "tsx",
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
    cssVariablePrefix: "--shiki-",
  });

  return { html, raw, filename };
}
