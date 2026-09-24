/**
 * Browser checks for the things that only show up when the page actually
 * renders — motion that leaves content invisible, decks that spill into the
 * next column, layout that breaks at phone width.
 *
 * These caught three real bugs that typecheck and lint could not see: a
 * reduced-motion branch that stranded the hero at opacity 0, fanned cards
 * clipping against their frame, and a View button buried under the deck.
 *
 * Needs a server running:
 *   npm run build && npm start
 *   npm run check:ui              # defaults to http://localhost:3000
 *   BASE_URL=http://localhost:3200 npm run check:ui
 */
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH ?? undefined,
  // Chromium's background calls hang against a restricted egress proxy, which
  // would otherwise make every `networkidle` wait time out.
  args: ["--disable-background-networking", "--disable-component-update"],
});

const fails = [];
const ok = (l) => console.log(`  ok    ${l}`);
const bad = (l, d) => {
  fails.push(l);
  console.log(`  FAIL  ${l} — ${d}`);
};

async function open(options) {
  const context = await browser.newContext({
    deviceScaleFactor: 1,
    ...options,
  });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  return [page, context];
}

const go = async (page, path) => {
  await page.goto(`${BASE}${path}`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(900);
};

// --- The deck must read as a deck, and stay in its own column -------------
{
  const [page, context] = await open({
    viewport: { width: 1400, height: 1100 },
  });
  await go(page, "/");

  const decks = await page.evaluate(() =>
    [...document.querySelectorAll("main a[aria-label]")].map((card) => {
      const cb = card.getBoundingClientRect();
      // The visible card is the inner element; the outer box carries the
      // transform and extends well past what anyone can see.
      const inner = [
        ...card.querySelectorAll(".absolute.origin-center > div"),
      ].map((el) => el.getBoundingClientRect());
      return {
        count: inner.length,
        lefts: inner.map((r) => Math.round(r.left)),
        clearLeft: Math.round(Math.min(...inner.map((r) => r.left)) - cb.left),
        clearRight: Math.round(
          cb.right - Math.max(...inner.map((r) => r.right)),
        ),
        opacities: [...card.querySelectorAll(".absolute.origin-center")].map(
          (el) => getComputedStyle(el).opacity,
        ),
      };
    }),
  );

  decks.every((d) => d.count === 3)
    ? ok("three layers per deck")
    : bad("three layers per deck", decks.map((d) => d.count).join(","));

  decks.every(
    (d) =>
      new Set(d.lefts).size === 3 && Math.abs(d.lefts[0] - d.lefts[2]) > 20,
  )
    ? ok(
        `layers offset distinctly at rest (card 1 x: ${decks[0].lefts.join(", ")})`,
      )
    : bad("layers offset at rest", JSON.stringify(decks.map((d) => d.lefts)));

  decks.every((d) => d.opacities.every((o) => Number(o) > 0.99))
    ? ok("all layers fully opaque")
    : bad("all layers fully opaque", "some dimmed");

  decks.every((d) => d.clearLeft >= 0 && d.clearRight >= 0)
    ? ok(
        `deck stays inside its column (L ${decks[0].clearLeft}px / R ${decks[0].clearRight}px)`,
      )
    : bad(
        "deck overlaps adjacent column",
        JSON.stringify(decks.map((d) => [d.clearLeft, d.clearRight])),
      );

  await context.close();
}

// --- Ghost CTA and accessible names ---------------------------------------
{
  const [page, context] = await open({
    viewport: { width: 1400, height: 1100 },
  });
  await go(page, "/");

  const cta = await page.evaluate(() => {
    const card = document.querySelector("main a[aria-label]");
    const el = [...card.querySelectorAll("span")].find((s) =>
      s.textContent.trim().startsWith("View"),
    );
    const cs = getComputedStyle(el);
    return {
      text: el.textContent.replace(/\s+/g, " ").trim(),
      background: cs.backgroundColor,
      border: cs.borderTopWidth,
    };
  });

  cta.text.startsWith("View")
    ? ok(`CTA labelled "${cta.text}"`)
    : bad("CTA label", cta.text);
  cta.background === "rgba(0, 0, 0, 0)" || cta.background === "transparent"
    ? ok("CTA is ghost (transparent at rest)")
    : bad("CTA is ghost", cta.background);
  parseFloat(cta.border) > 0
    ? ok("CTA has an outline")
    : bad("CTA outline", cta.border);

  const labels = await page
    .locator("main a[aria-label]")
    .evaluateAll((els) => els.map((e) => e.getAttribute("aria-label")));
  labels.some((l) => l?.includes("items"))
    ? ok("card links announce their item counts")
    : bad("card link names", labels.join(" | "));

  await context.close();
}

// --- Reduced motion must leave content readable ---------------------------
{
  const [page, context] = await open({
    viewport: { width: 1400, height: 1100 },
    reducedMotion: "reduce",
  });
  await go(page, "/");

  // Only content and motion layers count. Purely decorative art is allowed to
  // be faint — that is a design choice, not a stranded animation.
  const stranded = await page.evaluate(
    () =>
      [...document.querySelectorAll("main *")].filter((el) => {
        const s = getComputedStyle(el);
        if (s.opacity === "" || Number(s.opacity) >= 0.3) return false;
        const isMotionLayer = el.matches(".absolute.origin-center");
        const hasText = el.textContent.trim().length > 0;
        return isMotionLayer || hasText;
      }).length,
  );
  stranded === 0
    ? ok("no content stranded invisible under reduced motion")
    : bad("content stranded under reduced motion", `${stranded} elements`);

  const heroOpacity = await page
    .locator("h1")
    .first()
    .evaluate((el) => getComputedStyle(el).opacity);
  Number(heroOpacity) > 0.99
    ? ok("hero visible under reduced motion")
    : bad("hero visible under reduced motion", heroOpacity);

  await context.close();
}

// --- Each collection: title, back link, right number of items -------------
{
  const [page, context] = await open({
    viewport: { width: 1400, height: 1100 },
  });

  const collections = [
    {
      path: "/case-studies",
      title: "Design Case Studies",
      items: 3,
      sel: "ul li a[href^='/case-studies/']",
    },
    {
      path: "/interactions",
      title: "Front End Micro Interactions",
      items: 3,
      sel: "ul li a[href^='/interactions/']",
    },
    {
      path: "/visual",
      title: "Visual Design + Brand",
      items: 2,
      sel: "ul li a[href^='/visual/']",
    },
  ];

  for (const { path, title, items, sel } of collections) {
    await go(page, path);
    const h1 = (await page.locator("h1").first().textContent())?.trim();
    const back = await page.locator('main a[href="/"]').first().isVisible();
    const count = await page.locator(`main ${sel}`).count();
    h1 === title && back && count === items
      ? ok(`${path}: titled, back link, ${items} item(s)`)
      : bad(path, `title="${h1}" back=${back} items=${count}`);
  }
  await context.close();
}

// --- Detail pages: reachable, and the back link returns to the collection --
{
  const [page, context] = await open({
    viewport: { width: 1400, height: 1100 },
  });

  for (const [collection, slug, title] of [
    ["/case-studies", "fireplace-pro", "Fireplace Pro"],
    ["/interactions", "spring-toggle", "Spring toggle"],
    ["/visual", "obvious-brand", "Obvious"],
  ]) {
    await go(page, `${collection}/${slug}`);
    // Assert the real title, not just "there is an h1" — a 404 page has one
    // of those too, which is how a broken detail route hid here before.
    const h1 = (await page.locator("h1").first().textContent())?.trim();
    const back = await page.locator(`main a[href="${collection}"]`).count();
    h1 === title && back > 0
      ? ok(`${collection}/${slug}: "${title}", back link to collection`)
      : bad(`${collection}/${slug}`, `h1="${h1}" backLinks=${back}`);
  }
  await context.close();
}

// --- Every interaction resolves to a real registry component --------------
// The failure mode is a blank stage, which no other check would catch.
{
  const [page, context] = await open({
    viewport: { width: 1400, height: 1100 },
  });
  await go(page, "/interactions");

  const unresolved = await page.evaluate(
    () =>
      document.body.textContent?.includes("No component is registered under") ??
      false,
  );
  !unresolved
    ? ok("every interaction resolves to a registered component")
    : bad(
        "unregistered componentKey on the grid",
        "stage shows the fallback notice",
      );

  // And each stage actually rendered something interactive.
  const stages = await page.evaluate(() =>
    [...document.querySelectorAll("main ul > li")].map(
      (li) => li.querySelectorAll("button").length,
    ),
  );
  stages.length > 0 && stages.every((n) => n >= 2)
    ? ok(`all ${stages.length} demos mounted with controls`)
    : bad("demos mounted", stages.join(","));

  await context.close();
}

// --- Source code renders highlighted, with no highlighter shipped ---------
{
  const [page, context] = await open({
    viewport: { width: 1400, height: 1100 },
  });
  await go(page, "/interactions/spring-toggle");

  const code = await page.evaluate(() => {
    const block = document.querySelector(".shiki-block");
    if (!block) return null;
    const spans = [...block.querySelectorAll("span[style]")];
    const colours = new Set(
      spans.map((s) => getComputedStyle(s).color).filter(Boolean),
    );
    return {
      hasCode: (block.textContent ?? "").includes("SpringToggle"),
      distinctColours: colours.size,
    };
  });

  code?.hasCode
    ? ok("source block shows the real component")
    : bad("source block", "missing");
  (code?.distinctColours ?? 0) > 3
    ? ok(`syntax highlighted (${code.distinctColours} token colours)`)
    : bad("syntax highlighting", `${code?.distinctColours} colours`);

  await context.close();
}

// --- Old /work URLs redirect rather than 404 ------------------------------
{
  const [page, context] = await open({
    viewport: { width: 1400, height: 1100 },
  });
  for (const [from, to] of [
    ["/work", "/case-studies"],
    ["/work/fireplace-pro", "/case-studies/fireplace-pro"],
  ]) {
    const response = await page.goto(`${BASE}${from}`, {
      waitUntil: "domcontentloaded",
    });
    const landed = new URL(page.url()).pathname;
    landed === to && (response?.status() ?? 0) < 400
      ? ok(`${from} redirects to ${to}`)
      : bad(`${from} redirect`, `landed on ${landed}`);
  }
  await context.close();
}

// --- Every route, desktop and phone ---------------------------------------
const ROUTES = [
  "/",
  "/case-studies",
  "/case-studies/fireplace-pro",
  "/interactions",
  "/interactions/spring-toggle",
  "/visual",
  "/visual/obvious-brand",
  "/about",
  "/lab",
];
for (const width of [1400, 390]) {
  const [page, context] = await open({ viewport: { width, height: 900 } });
  for (const path of ROUTES) {
    await go(page, path);
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    const h1s = await page.locator("h1").count();
    const dupes = await page.evaluate(() => {
      const ids = [...document.querySelectorAll("[id]")].map((e) => e.id);
      return ids.filter((id, i) => ids.indexOf(id) !== i);
    });
    overflow <= 0 && h1s === 1 && dupes.length === 0
      ? ok(`${width}px ${path}`)
      : bad(
          `${width}px ${path}`,
          `overflow=${overflow} h1=${h1s} dupes=${dupes.join(",")}`,
        );
  }
  await context.close();
}

await browser.close();
console.log(
  fails.length === 0
    ? "\nALL UI CHECKS PASSED"
    : `\n${fails.length} UI CHECK(S) FAILED`,
);
process.exit(fails.length === 0 ? 0 : 1);
