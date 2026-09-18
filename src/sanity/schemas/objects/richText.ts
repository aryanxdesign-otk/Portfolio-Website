import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Shared annotation set for any rich text field. Keeping links in one place
 * means the renderer only has to handle one link shape.
 */
const annotations = [
  defineArrayMember({
    name: "link",
    title: "Link",
    type: "object",
    fields: [
      defineField({
        name: "href",
        title: "URL",
        type: "url",
        validation: (rule) =>
          rule.required().uri({
            scheme: ["http", "https", "mailto", "tel"],
            allowRelative: true,
          }),
      }),
      defineField({
        name: "newTab",
        title: "Open in a new tab",
        type: "boolean",
        initialValue: true,
      }),
    ],
  }),
];

/**
 * Short rich text: bold, italic and links only. For bios and intros where
 * headings and media would be out of place.
 */
export const simpleRichText = defineType({
  name: "simpleRichText",
  title: "Text",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [{ title: "Normal", value: "normal" }],
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
        ],
        annotations,
      },
    }),
  ],
});

/**
 * The case study body. This is the schema that decides whether case studies
 * read as case studies or as blog posts — the custom blocks below are the
 * whole point.
 */
export const caseStudyBody = defineType({
  name: "caseStudyBody",
  title: "Body",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Section heading", value: "h2" },
        { title: "Subheading", value: "h3" },
        { title: "Lead paragraph", value: "lead" },
      ],
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
          { title: "Code", value: "code" },
        ],
        annotations,
      },
    }),
    defineArrayMember({ type: "imageBlock" }),
    defineArrayMember({ type: "imageGrid" }),
    defineArrayMember({ type: "videoBlock" }),
    defineArrayMember({ type: "pullQuote" }),
    defineArrayMember({ type: "statRow" }),
    defineArrayMember({ type: "figmaEmbed" }),
    defineArrayMember({ type: "spacer" }),
  ],
});

/** Blog post body — the same blocks minus the case-study-specific ones. */
export const postBody = defineType({
  name: "postBody",
  title: "Body",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Section heading", value: "h2" },
        { title: "Subheading", value: "h3" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
          { title: "Code", value: "code" },
        ],
        annotations,
      },
    }),
    defineArrayMember({ type: "imageBlock" }),
    defineArrayMember({ type: "videoBlock" }),
    defineArrayMember({ type: "pullQuote" }),
  ],
});
