import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

type WebhookPayload = {
  _type?: string;
  slug?: string | null;
};

// Sanity document type -> cache tags used by `sanityFetch` in the pages.
const TAGS_BY_TYPE: Record<string, string[]> = {
  home: ["home"],
  profile: ["profile", "home"],
  experience: ["experience", "home"],
  project: ["project"],
  post: ["post"],
  category: ["category", "post"],
};

export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ message: "Revalidation is not configured" }, { status: 401 });
  }

  try {
    const { isValidSignature, body } = await parseBody<WebhookPayload>(req, secret);

    if (!isValidSignature) {
      return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
    }
    if (!body?._type) {
      return NextResponse.json({ message: "Bad request: missing _type" }, { status: 400 });
    }

    const tags = TAGS_BY_TYPE[body._type];
    if (!tags) {
      return NextResponse.json({ revalidated: false, type: body._type, tags: [] });
    }

    // `{ expire: 0 }` expires immediately so the next request fetches fresh data
    // (Next 16 requires a second argument; "max" would serve stale while revalidating).
    for (const tag of tags) revalidateTag(tag, { expire: 0 });

    return NextResponse.json({ revalidated: true, type: body._type, tags });
  } catch (error) {
    console.error("Sanity revalidate webhook failed:", error instanceof Error ? error.message : "unknown error");
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
