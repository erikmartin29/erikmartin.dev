import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

/**
 * Sanity webhook handler for tag-based on-demand revalidation.
 *
 * This follows the approach described in
 * https://victoreke.com/blog/sanity-webhooks-and-on-demand-revalidation-in-nextjs
 *
 * IMPORTANT FOR HOSTING:
 * - On Vercel, `revalidateTag` is fully supported.
 * - On AWS Amplify Hosting, on-demand revalidation APIs like `revalidateTag`
 *   are not currently supported, so this route will run but cache invalidation
 *   may be ignored by the platform. In that case you may want to switch your
 *   Sanity client to `cache: "no-store"` in production as well.
 */
export async function POST(req: NextRequest) {
  try {
    if (!process.env.SANITY_REVALIDATE_SECRET) {
      console.error("Missing SANITY_REVALIDATE_SECRET environment variable");
      return new Response("Server Configuration Error", { status: 500 });
    }

    const {
      body,
      isValidSignature,
    } = await parseBody<{
      _type: string;
      slug?: string | undefined;
    }>(req, process.env.SANITY_REVALIDATE_SECRET);

    if (!isValidSignature) {
      return new Response("Invalid Signature", { status: 401 });
    }

    if (!body?._type) {
      return new Response("Bad Request", { status: 400 });
    }

    // Use the Sanity document `_type` as the cache tag.
    // Cast to a single-argument function to satisfy the current Next.js types.
    const revalidate = revalidateTag as unknown as (tag: string) => void;
    revalidate(body._type);

    return NextResponse.json({
      status: 200,
      revalidated: true,
      now: Date.now(),
      body,
    });
  } catch (error: unknown) {
    console.error(error);
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return new Response(message, { status: 500 });
  }
}
