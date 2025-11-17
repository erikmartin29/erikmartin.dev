import { createClient } from "next-sanity";

export const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || "",
  dataset: "production",
  apiVersion: "2025-07-09",
  useCdn: false,
});
