import { BlogContent } from "@/components/blog-content";
import { sanityFetch } from "@/sanity/live";
import { BLOG_QUERY } from "@/sanity/queries";
import type { BLOG_QUERYResult } from "@/sanity/sanity.types";

export const metadata = {
  title: "Blog | Erik Martin",
  description: "Thoughts on design engineering.",
};

const FALLBACK_POSTS: BLOG_QUERYResult = [
  {
    _id: "1",
    slug: { _type: "slug", current: "design-systems-at-scale" },
    title: "Design Systems at Scale",
    excerpt:
      "How to build and maintain a design system that works across dozens of products and hundreds of engineers without slowing anyone down.",
    publishedAt: "2026-02-03T12:00:00Z",
    categories: ["Design"],
  } satisfies BLOG_QUERYResult[number],
  {
    _id: "2",
    slug: { _type: "slug", current: "react-server-components-in-practice" },
    title: "React Server Components in Practice",
    excerpt:
      "A practical deep-dive into RSC architecture — what works, what doesn't, and patterns I've found useful after shipping several production apps.",
    publishedAt: "2026-01-18T12:00:00Z",
    categories: ["Engineering"],
  } satisfies BLOG_QUERYResult[number],
  {
    _id: "3",
    slug: { _type: "slug", current: "the-gap-between-design-and-code" },
    title: "The Gap Between Design and Code",
    excerpt:
      "Why the handoff between designers and engineers is still broken in 2026, and how design engineering as a discipline is starting to close that gap.",
    publishedAt: "2025-12-10T12:00:00Z",
    categories: ["Design", "Engineering"],
  } satisfies BLOG_QUERYResult[number],
  {
    _id: "4",
    slug: { _type: "slug", current: "building-with-ai-assisted-tools" },
    title: "Building with AI-Assisted Tools",
    excerpt:
      "An honest look at how AI coding assistants have changed my daily workflow — the good, the surprising, and the things I still do the old way.",
    publishedAt: "2025-11-22T12:00:00Z",
    categories: ["Engineering"],
  } satisfies BLOG_QUERYResult[number],
  {
    _id: "5",
    slug: { _type: "slug", current: "typography-on-the-web" },
    title: "Typography on the Web in 2025",
    excerpt:
      "Variable fonts, optical sizing, and the new CSS properties that finally make web typography feel as intentional as print.",
    publishedAt: "2025-10-05T12:00:00Z",
    categories: ["Design"],
  } satisfies BLOG_QUERYResult[number],
  {
    _id: "6",
    slug: { _type: "slug", current: "nx-monorepo-lessons" },
    title: "Lessons from Two Years in an Nx Monorepo",
    excerpt:
      "What I've learned maintaining a large-scale Nx workspace — caching strategies, generator patterns, and keeping CI fast as the codebase grows.",
    publishedAt: "2025-09-14T12:00:00Z",
    categories: ["Engineering"],
  } satisfies BLOG_QUERYResult[number],
];

export default async function BlogPage() {
  const { data: posts } = await sanityFetch<BLOG_QUERYResult>({
    query: BLOG_QUERY,
  });

  const displayPosts: BLOG_QUERYResult =
    posts && posts.length > 0 ? posts : FALLBACK_POSTS;

  return <BlogContent posts={displayPosts} />;
}
