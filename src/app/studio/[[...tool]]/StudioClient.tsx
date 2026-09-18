"use client";

import { NextStudio } from "next-sanity/studio";

import config from "@/../sanity.config";

/**
 * The Studio itself. Loaded only in the browser (see StudioLoader), because
 * the config carries schema definitions, validation functions and React
 * components that have no business being evaluated during a server render.
 */
export default function StudioClient() {
  return <NextStudio config={config} />;
}
