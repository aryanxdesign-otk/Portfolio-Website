import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

import { env } from "@/lib/env";
import { DOCUMENT_TYPES, type DocumentType } from "@/sanity/documentTypes";

/**
 * Sanity publish webhook.
 *
 * This is what makes a statically generated site feel live: publishing in the
 * Studio invalidates only the cache tags for the document type that changed,
 * so the edit appears within seconds with no rebuild and no redeploy.
 *
 * Setup instructions are in the README. The webhook must send a secret
 * matching SANITY_REVALIDATE_SECRET, and project `{_type}` at minimum.
 */

type WebhookPayload = {
  _type?: string;
  slug?: string;
};

export async function POST(request: NextRequest) {
  if (!env.sanity.revalidateSecret) {
    console.error("[revalidate] SANITY_REVALIDATE_SECRET is not set");
    return NextResponse.json(
      { message: "Revalidation is not configured" },
      { status: 500 },
    );
  }

  let body: WebhookPayload | null;
  let isValidSignature: boolean | null;

  try {
    // Verifies the sanity-webhook-signature header against the shared secret.
    ({ body, isValidSignature } = await parseBody<WebhookPayload>(
      request,
      env.sanity.revalidateSecret,
    ));
  } catch (error) {
    console.error("[revalidate] could not parse webhook body", error);
    return NextResponse.json({ message: "Bad request" }, { status: 400 });
  }

  if (!isValidSignature) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
  }

  const type = body?._type;

  if (!type || !DOCUMENT_TYPES.includes(type as DocumentType)) {
    // Not an error — Sanity emits events for asset documents too, and those
    // have nothing cached against them.
    return NextResponse.json({ message: `Ignored type: ${type ?? "none"}` });
  }

  // 'max' gives the longest stale-while-revalidate window, so visitors mid-
  // request keep getting an instant response while the fresh copy builds.
  revalidateTag(type, "max");

  return NextResponse.json({
    revalidated: true,
    tag: type,
    slug: body?.slug ?? null,
    now: Date.now(),
  });
}
