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
  {
    // The verification scripts assert with `condition ? ok(…) : bad(…)`, which
    // is expression-as-statement by design — it keeps each assertion to one
    // readable line. Idiomatic in test code, so the rule is off here only.
    files: ["scripts/**/*.mjs"],
    rules: { "@typescript-eslint/no-unused-expressions": "off" },
  },
]);

export default eslintConfig;
