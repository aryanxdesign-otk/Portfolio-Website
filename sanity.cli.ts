import { defineCliConfig } from "sanity/cli";

/**
 * Used by the Sanity CLI for `sanity schema extract` and `sanity typegen`,
 * which back the `npm run typegen` script.
 */
export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  },
  typegen: {
    // Where the GROQ queries live (defineQuery calls are what typegen finds).
    path: "./src/**/*.{ts,tsx}",
    schema: "./sanity/extract.json",
    generates: "./src/sanity/types.generated.ts",
    // Types client.fetch() by the query string passed to it.
    overloadClientMethods: true,
  },
});
