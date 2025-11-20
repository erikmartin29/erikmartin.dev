import { SectionHeading } from "@/components/ui/section-heading";
import { GlassCard } from "@/components/ui/glass-card";
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { sanityFetch } from "@/sanity/live";
import { BLOG_QUERY } from "@/sanity/queries";
import type { BLOG_QUERYResult } from "@/sanity/sanity.types";
// import { urlFor } from "@/sanity/client"; // Not using images in list view currently but could

export const metadata = {
  title: "Blog | Erik Martin",
  description: "Thoughts on development, design, and technology.",
};

export default async function BlogPage() {
  const { data: posts } = await sanityFetch<BLOG_QUERYResult>({
    query: BLOG_QUERY,
    // Blog index depends on `post` documents (and their categories).
    tags: ["post"],
  });

  // Fallback posts if none in CMS
  const displayPosts: BLOG_QUERYResult =
    posts && posts.length > 0
      ? posts
      : [
          {
            _id: "1",
            slug: { _type: "slug", current: "future-of-web-development" },
            title: "The Future of Web Development in 2025",
            excerpt:
              "Exploring the rise of AI-assisted coding, the dominance of React Server Components, and the return of skeuomorphism.",
            publishedAt: "2025-11-15T12:00:00Z",
            categories: ["Tech"],
            mainImage: null,
          } satisfies BLOG_QUERYResult[number],
        ];

  return (
    <div className="space-y-12">
      <SectionHeading 
        title="Latest Thoughts" 
        subtitle="Insights, tutorials, and rants about the tech industry."
      />

      <div className="grid gap-6">
        {displayPosts.map((post) => {
          const slug = post.slug?.current;
          if (!slug) return null;
          return (
          <Link key={post._id} href={`/blog/${slug}`} className="group">
            <GlassCard variant="hover" className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-center justify-between">
              <div className="flex flex-col gap-3 max-w-2xl">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {post.categories && post.categories[0] && (
                    <span className="text-accent font-medium px-2 py-0.5 rounded-full bg-accent/10">
                      {post.categories[0]}
                    </span>
                  )}
                  {post.publishedAt && (
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />{" "}
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
                
                <h3 className="text-2xl font-bold group-hover:text-accent transition-colors">
                  {post.title}
                </h3>
                
                <p className="text-muted-foreground line-clamp-2">
                  {post.excerpt}
                </p>
              </div>

              <div className="text-accent opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                <ArrowRight size={32} />
              </div>
            </GlassCard>
          </Link>
        )})}
      </div>
    </div>
  );
}
