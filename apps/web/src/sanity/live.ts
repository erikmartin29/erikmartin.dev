import "server-only";

import { client } from "@/sanity/client";
import { defineLive } from "next-sanity/live";
import type { QueryParams } from "next-sanity";

type SanityFetchArgs<QueryResponse> = {
  query: string;
  params?: QueryParams;
};

/**
 * Simple Sanity fetch helper that always bypasses the Next.js cache.
 *
 * This is optimized for hosting environments like AWS Amplify that don't
 * support on-demand ISR APIs such as `revalidateTag`. Every request goes
 * directly to Sanity, so content changes in Studio are reflected on both
 * localhost and the deployed site without any extra revalidation wiring.
 */
export async function sanityFetch<QueryResponse>({
  query,
  params = {},
}: SanityFetchArgs<QueryResponse>): Promise<{ data: QueryResponse }> {
  const data = await client.fetch<QueryResponse>(query, params, {
    cache: "no-store",
  });

  return { data };
}

/**
 * Live preview wiring for Sanity Studio drafts.
 * This keeps the existing `<SanityLive />` component in your layout working.
 */
export const { SanityLive } = defineLive({
  client,
});