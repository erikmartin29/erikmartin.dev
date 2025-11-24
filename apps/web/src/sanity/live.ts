import "server-only";

import { client } from "@/sanity/client";
import { defineLive } from "next-sanity/live";
import type { QueryParams } from "next-sanity";

type SanityFetchArgs<QueryResponse> = {
  query: string;
  params?: QueryParams;
};

export async function sanityFetch<QueryResponse>({
  query,
  params = {},
}: SanityFetchArgs<QueryResponse>): Promise<{ data: QueryResponse }> {
  const data = await client.fetch<QueryResponse>(query, params, {
    cache: "no-store",
  });

  return { data };
}

export const { SanityLive } = defineLive({
  client,
});