/**
 * Guards against the one Portable Text failure mode that is completely silent:
 * a block registered in the schema with no matching renderer just disappears
 * from the page. No error, no warning — the content is simply not there.
 *
 * Compares the block types in the body schemas against the keys in
 * portableTextComponents.types, and fails if they disagree.
 *
 * Run as part of `npm run check`.
 */
import { readFileSync } from "node:fs";

const SCHEMA = "./sanity/extract.json";
const RENDERER = "./src/components/portable-text/blocks.tsx";
const BODY_TYPES = ["caseStudyBody", "postBody"];

function fail(message) {
  console.error(`\n✗ ${message}\n`);
  process.exit(1);
}

let schema;
try {
  schema = JSON.parse(readFileSync(SCHEMA, "utf8"));
} catch {
  fail(`Could not read ${SCHEMA}. Run \`npm run typegen\` first.`);
}

// Collect every non-text block type any body schema can contain.
const schemaBlocks = new Set();
for (const name of BODY_TYPES) {
  const type = schema.find((t) => t.name === name);
  if (!type) fail(`Body type "${name}" is missing from the extracted schema.`);

  // Shape: value.of is a union, whose members name their type either via
  // rest.name (a referenced object type) or a literal _type attribute.
  const members = type.value?.of?.of ?? [];
  if (members.length === 0) fail(`Body type "${name}" has no members.`);

  for (const member of members) {
    const ref =
      member.rest?.name ?? member.attributes?._type?.value?.value ?? null;
    // "block" is the built-in prose type, handled by `block:` not `types:`.
    if (ref && ref !== "block") schemaBlocks.add(ref);
  }
}

const source = readFileSync(RENDERER, "utf8");
const typesStart = source.indexOf("types: {");
if (typesStart === -1) fail(`No \`types:\` map found in ${RENDERER}.`);
// Read only as far as the sibling `block:` map so prose styles are not counted.
const typesSection = source.slice(
  typesStart,
  source.indexOf("\n  block: {", typesStart),
);
const rendered = new Set(
  [...typesSection.matchAll(/^\s{4}(\w+):\s*\(/gm)].map((m) => m[1]),
);

const missing = [...schemaBlocks].filter((t) => !rendered.has(t)).sort();
const orphaned = [...rendered].filter((t) => !schemaBlocks.has(t)).sort();

if (missing.length > 0) {
  fail(
    `These block types are in the schema but have no renderer, so they would ` +
      `render as nothing:\n    ${missing.join("\n    ")}\n\n  ` +
      `Add them to \`types\` in ${RENDERER}.`,
  );
}

if (orphaned.length > 0) {
  fail(
    `These renderers have no matching schema block and are dead code:\n    ` +
      `${orphaned.join("\n    ")}\n\n  ` +
      `Remove them, or add the block to a body schema.`,
  );
}

console.log(
  `✓ Portable Text: ${schemaBlocks.size} block types, all rendered ` +
    `(${[...schemaBlocks].sort().join(", ")})`,
);
