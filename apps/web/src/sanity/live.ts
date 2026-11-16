import "server-only";

import { client } from "@/sanity/client";
import type { QueryParams } from "next-sanity";

/** Time-based fallback; on-demand revalidation (see /api/revalidate) is the primary path. */
export const DEFAULT_REVALIDATE_SECONDS = 3600;

type SanityFetchArgs = {
  query: string;
  params?: QueryParams;
  /** Cache tags used by on-demand revalidation (`revalidateTag`). */
  tags?: string[];
  /** Seconds before the cached result is considered stale. */
  revalidate?: number;
};

/**
 * Cached Sanity fetch. Results go through the Next.js data cache, so pages that
 * use it are statically generated and re-generated on `revalidate` / `revalidateTag`.
 */
export async function sanityFetch<QueryResponse>({
  query,
  params = {},
  tags,
  revalidate = DEFAULT_REVALIDATE_SECONDS,
}: SanityFetchArgs): Promise<{ data: QueryResponse }> {
  const data = await client.fetch<QueryResponse>(query, params, {
    next: { revalidate, tags },
  });

  return { data };
}
