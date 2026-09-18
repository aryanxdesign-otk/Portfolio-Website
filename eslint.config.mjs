import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Written by `npm run typegen` and overwritten on every run — linting it
    // would only ever produce findings we cannot fix at the source.
    "src/sanity/types.generated.ts",
    "sanity/extract.json",
  ]),
]);

export default eslintConfig;
