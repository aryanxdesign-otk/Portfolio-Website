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
});
