import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";

// Core Sanity client used across the app (including image URLs).
// Published content is read through the Sanity API CDN; the Next.js data cache and
// the revalidate webhook (/api/revalidate) keep it fresh.
export const client = createClient({
  projectId: "5l61z3ol",
  dataset: "production",
  apiVersion: "2025-07-09",
  useCdn: true,
});

const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}
