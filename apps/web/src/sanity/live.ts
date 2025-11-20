import "server-only";

import { revalidateTag } from "next/cache";
import { client } from "@/sanity/client";
import { defineLive } from "next-sanity/live";
import type { QueryParams } from "next-sanity";

type SanityFetchArgs<QueryResponse> = {
  query: string;
  params?: QueryParams;
  /**
   * Cache tags to use for this query. Typically you want to include the
   * document `_type` values that this query depends on, for example:
   * - `["home", "profile", "experience", "project", "post"]`
   */
  tags: string[];
};

/**
 * Tag-aware Sanity fetch helper.
 *
 * - In development, we always disable the Next.js cache so content updates are instant.
 * - In production, we use `force-cache` with `next.tags`, which lets the
 *   `/api/revalidate` webhook route purge content via `revalidateTag`.
 *
 * NOTE: Some hosts (including AWS Amplify at the time of writing) may not fully
 * support on-demand revalidation APIs like `revalidateTag`. In that case this
 * helper still works, but you may want to switch `cache` to `"no-store"` in
 * production as well to completely avoid stale content.
 */
export async function sanityFetch<QueryResponse>({
  query,
  params = {},
  tags,
}: SanityFetchArgs<QueryResponse>): Promise<{ data: QueryResponse }> {
  const isDev = process.env.NODE_ENV === "development";

  const data = await client.fetch<QueryResponse>(query, params, {
    cache: isDev ? "no-store" : "force-cache",
    next: { tags },
  });

  return { data };
}

/**
 * Live preview wiring for Sanity Studio drafts.
 * This keeps the existing `<SanityLive />` component in your layout working.
 */
export const { SanityLive } = defineLive({
  client,
  // When you want to pass additional config (like stega or studioUrl),
  // you can extend this object; for now we keep the default behaviour.
});