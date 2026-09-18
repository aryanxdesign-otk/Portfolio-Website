import type { SchemaTypeDefinition } from "sanity";

// Objects
import { captionedImage } from "./objects/captionedImage";
import { figmaEmbed } from "./objects/figmaEmbed";
import { imageBlock } from "./objects/imageBlock";
import { imageGrid } from "./objects/imageGrid";
import { pullQuote } from "./objects/pullQuote";
import { caseStudyBody, postBody, simpleRichText } from "./objects/richText";
import { seo } from "./objects/seo";
import { socialLink } from "./objects/socialLink";
import { spacer } from "./objects/spacer";
import { statRow } from "./objects/statRow";
import { videoBlock } from "./objects/videoBlock";

// Documents
import { about } from "./documents/about";
import { caseStudy } from "./documents/caseStudy";
import { experience } from "./documents/experience";
import { homePage } from "./documents/homePage";
import { post } from "./documents/post";
import { shot } from "./documents/shot";
import { siteSettings } from "./documents/siteSettings";
import { testimonial } from "./documents/testimonial";

/** Document types that exist exactly once. Used by the Studio structure. */
export const SINGLETON_TYPES = ["homePage", "about", "siteSettings"] as const;
export type SingletonType = (typeof SINGLETON_TYPES)[number];

/** Types the revalidation webhook knows how to invalidate. */
export const DOCUMENT_TYPES = [
  "caseStudy",
  "post",
  "shot",
  "testimonial",
  "experience",
  "about",
  "homePage",
  "siteSettings",
] as const;
export type DocumentType = (typeof DOCUMENT_TYPES)[number];

export const schemaTypes: SchemaTypeDefinition[] = [
  // Documents
  caseStudy,
  post,
  shot,
  testimonial,
  experience,
  about,
  homePage,
  siteSettings,
  // Objects
  captionedImage,
  imageBlock,
  imageGrid,
  videoBlock,
  pullQuote,
  statRow,
  figmaEmbed,
  spacer,
  simpleRichText,
  caseStudyBody,
  postBody,
  socialLink,
  seo,
];
