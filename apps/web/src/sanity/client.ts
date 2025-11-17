import { createClient } from "next-sanity";

export const client = createClient({
  projectId: '5l61z3ol',
  dataset: "production",
  apiVersion: "2025-07-09",
  useCdn: false,
});
