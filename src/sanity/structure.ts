import type { StructureResolver } from "sanity/structure";

/**
 * Studio sidebar layout.
 *
 * Without this, every document type renders as a list you can add to — which
 * would let you create a second "About page". Singletons are pinned as single
 * editable documents with a fixed ID instead, and the document actions in
 * sanity.config.ts stop them being duplicated or deleted.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Home page")
        .id("homePage")
        .child(S.document().schemaType("homePage").documentId("homePage")),

      S.listItem()
        .title("About page")
        .id("about")
        .child(S.document().schemaType("about").documentId("about")),

      S.divider(),

      S.documentTypeListItem("caseStudy").title("Case studies"),
      S.documentTypeListItem("interaction").title("Interactions"),
      S.documentTypeListItem("visualProject").title("Visual & brand"),
      S.documentTypeListItem("shot").title("Playground"),
      S.documentTypeListItem("post").title("Blog posts"),

      S.divider(),

      S.documentTypeListItem("testimonial").title("Testimonials"),
      S.documentTypeListItem("experience").title("Experience"),

      S.divider(),

      S.listItem()
        .title("Site settings")
        .id("siteSettings")
        .child(
          S.document().schemaType("siteSettings").documentId("siteSettings"),
        ),
    ]);
