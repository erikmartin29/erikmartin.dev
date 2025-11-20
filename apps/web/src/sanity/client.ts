import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";

// Core Sanity client used across the app (including image URLs and live data)
export const client = createClient({
  projectId: "5l61z3ol",
  dataset: "production",
  apiVersion: "2025-07-09",
  // In development or when running locally we want fresh data.
  // In production we allow caching, but on-demand revalidation
  // (when supported by the host) will keep things fresh.
  useCdn: process.env.NODE_ENV === "development",
});

const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}
