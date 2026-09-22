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

// --- Category pages: back link, title, and the right blocks ---------------
{
  const [page, context] = await open({
    viewport: { width: 1400, height: 1100 },
  });

  const cases = [
    { category: "case-studies", title: "Design Case Studies", blocks: 2 },
    { category: "brand", title: "Visual Design + Brand", blocks: 1 },
    {
      category: "micro-interactions",
      title: "Front End Micro Interactions",
      blocks: 0,
    },
  ];

  for (const { category, title, blocks } of cases) {
    await go(page, `/work?category=${category}`);
    const h1 = (await page.locator("h1").first().textContent())?.trim();
    const back = await page.locator('main a[href="/"]').first().isVisible();
    const count = await page.locator("main ul li a[href^='/work/']").count();

    h1 === title && back && count === blocks
      ? ok(`${category}: titled, back link, ${blocks} block(s)`)
      : bad(`${category}`, `title="${h1}" back=${back} blocks=${count}`);
  }

  // An unknown category must not 404 or render a blank page.
  await go(page, "/work?category=nonsense");
  const fallback = await page.locator("main ul li a[href^='/work/']").count();
  fallback === 3
    ? ok("unknown category falls back to showing everything")
    : bad("unknown category fallback", `${fallback} blocks`);

  await context.close();
}

// --- The footer is unified across every page ------------------------------
{
  const [page, context] = await open({
    viewport: { width: 1400, height: 1100 },
  });
  for (const path of ["/", "/work", "/about", "/lab", "/work/fireplace-pro"]) {
    await go(page, path);
    const footer = await page.evaluate(() => {
      const el = document.querySelector("footer");
      if (!el) return null;
      const text = el.textContent ?? "";
      return {
        trustedBy: text.includes("Trusted by"),
        heading: text.includes("Lets craft"),
        email: Boolean(el.querySelector('a[href^="mailto:"]')),
        wordmark: Boolean(
          [...el.querySelectorAll('[aria-hidden="true"]')].find(
            (n) => n.textContent?.trim() === "DESIGN",
          ),
        ),
      };
    });
    footer &&
    footer.trustedBy &&
    footer.heading &&
    footer.email &&
    footer.wordmark
      ? ok(`footer complete on ${path}`)
      : bad(`footer on ${path}`, JSON.stringify(footer));
  }
  await context.close();
}

// --- Every route, desktop and phone ---------------------------------------
const ROUTES = [
  "/",
  "/work",
  "/work?category=brand",
  "/about",
  "/lab",
  "/work/fireplace-pro",
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
