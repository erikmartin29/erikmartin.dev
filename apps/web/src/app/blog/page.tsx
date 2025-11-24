import { SectionHeading } from "@/components/ui/section-heading";
import { GlassCard } from "@/components/ui/glass-card";
import Link from "next/link";
import Image from "next/image";
import { Calendar } from "lucide-react";
import { sanityFetch } from "@/sanity/live";
import { BLOG_QUERY } from "@/sanity/queries";
import type { BLOG_QUERYResult } from "@/sanity/sanity.types";
import { urlFor } from "@/sanity/client";

export const metadata = {
  title: "Blog | Erik Martin",
  description: "Thoughts on development, design, and technology.",
};

export default async function BlogPage() {
  const { data: posts } = await sanityFetch<BLOG_QUERYResult>({
    query: BLOG_QUERY,
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
        title="Latest Posts" 
      />

      <div className="grid gap-6">
        {displayPosts.map((post) => {
          const slug = post.slug?.current;
          if (!slug) return null;
          return (
          <Link key={post._id} href={`/blog/${slug}`} className="group block">
            <GlassCard variant="hover" className="p-6 flex flex-row gap-6 items-start">
              {post.mainImage && (
                  <Image
                    src={urlFor(post.mainImage).width(600).height(400).url()}
                    alt={post.title || "Blog post image"}
                    width={200}
                    height={100}
                    className="rounded-xl"
                  />
              )}
              
              <div className="flex flex-col gap-3 flex-1 min-w-0 pt-1">
                <h2 className="text-2xl md:text-2xl font-bold group-hover:text-accent transition-colors leading-tight">
                  {post.title}
                </h2>
                
                <p className="text-muted-foreground line-clamp-1 text-sm md:text-base">
                  {post.excerpt}
                </p>

                <div className="flex flex-col gap-2 text-xs text-muted-foreground mt-auto items-start">
                  {post.publishedAt && (
                    <span className="flex items-center">
                      <Calendar size={14}  />
                      <p className="text-muted-foreground line-clamp-2 text-sm px-2">
                      {new Date(post.publishedAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                      </p>
                    </span>
                  )}

                  {post.categories && post.categories[0] && (
                    <span className="font-mono font-medium uppercase tracking-wider text-accent bg-accent/10 px-2 py-0.5 rounded-full text-[10px]">
                      {post.categories[0]}
                    </span>
                  )}
                </div>
              </div>
            </GlassCard>
          </Link>
        )})}
      </div>
    </div>
  );
}
