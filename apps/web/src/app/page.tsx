import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/sanity/live";

const TEST_QUERY = defineQuery(`*[
  _type == "test"
][0]{_id, name}`);

export default async function IndexPage() {
  const { data: test } = await sanityFetch({ query: TEST_QUERY });

  return (
    <main className="flex min-h-screen flex-col p-24 gap-12">
      <h1 className="text-4xl font-bold tracking-tighter text-gray-900 dark:text-white">
        Test document
      </h1>
      <p className="text-2xl text-gray-900 dark:text-white">
        {test?.name ?? "No Test document found"}
      </p>
    </main>
  );
}
