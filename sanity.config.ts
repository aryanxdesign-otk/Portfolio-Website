"use client";

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { env } from "@/lib/env";
import { SINGLETON_TYPES } from "@/sanity/documentTypes";
import { schemaTypes } from "@/sanity/schemas";
import { structure } from "@/sanity/structure";

/**
 * Sanity Studio, served from /studio inside this same Next app — one repo,
 * one deploy, no separate hosting for the CMS.
 */
export default defineConfig({
  basePath: "/studio",
  name: "portfolio",
  title: "Portfolio",

  projectId: env.sanity.projectId,
  dataset: env.sanity.dataset,

  plugins: [
    structureTool({ structure }),
    // GROQ playground for testing queries against real content.
    visionTool({ defaultApiVersion: env.sanity.apiVersion }),
  ],

  schema: {
    types: schemaTypes,
    // Singletons already exist and are reached from the sidebar, so they
    // should not appear in the global "create new document" menu.
    templates: (templates) =>
      templates.filter(
        ({ schemaType }) =>
          !SINGLETON_TYPES.includes(
            schemaType as (typeof SINGLETON_TYPES)[number],
          ),
      ),
  },

  document: {
    // Strip the actions that would let a singleton be duplicated or deleted.
    actions: (actions, { schemaType }) =>
      SINGLETON_TYPES.includes(schemaType as (typeof SINGLETON_TYPES)[number])
        ? actions.filter(
            ({ action }) =>
              action &&
              ["publish", "discardChanges", "restore"].includes(action),
          )
        : actions,
  },
});
