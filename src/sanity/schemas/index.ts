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
import { interaction } from "./documents/interaction";
import { post } from "./documents/post";
import { shot } from "./documents/shot";
import { siteSettings } from "./documents/siteSettings";
import { testimonial } from "./documents/testimonial";
import { visualProject } from "./documents/visualProject";

// Re-exported so Studio-side code has one obvious import, while server code
// can import from "@/sanity/documentTypes" without pulling in the schemas.
export {
  DOCUMENT_TYPES,
  SINGLETON_TYPES,
  type DocumentType,
  type SingletonType,
} from "../documentTypes";

export const schemaTypes: SchemaTypeDefinition[] = [
  // Documents
  caseStudy,
  interaction,
  visualProject,
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
