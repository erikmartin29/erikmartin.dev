import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import { sanityFetch } from "@/sanity/live";
import { POST_QUERY } from "@/sanity/queries";
import type { POST_QUERYResult } from "@/sanity/sanity.types";
import { PortableText } from "@portabletext/react";
import { urlFor } from "@/sanity/client";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: post } = await sanityFetch<POST_QUERYResult>({
    query: POST_QUERY,
    params: { slug },
  });
  if (!post) return { title: "Post Not Found" };
  return {
    title: `${post.title} | Erik Martin`,
    description: post.title ?? undefined,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: post } = await sanityFetch<POST_QUERYResult>({
    query: POST_QUERY,
    params: { slug },
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Link href="/blog">
        <GlassButton variant="ghost" size="sm" className="gap-2 -ml-4">
          <ArrowLeft size={16} /> Back to Blog
        </GlassButton>
      </Link>

      <header className="space-y-6">
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {post.categories && post.categories.length > 0 && (
            <span className="text-accent font-medium px-2 py-0.5 rounded-full bg-accent/10">
              {post.categories[0]}
            </span>
          )}
          {post.publishedAt && (
            <span className="flex items-center gap-1">
              <Calendar size={14} />{" "}
              {new Date(post.publishedAt).toLocaleDateString(undefined, {
                dateStyle: "long",
              })}
            </span>
          )}
        </div>

        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{post.title}</h1>
      </header>

      {post.mainImage && (
        <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10">
           <img 
             src={urlFor(post.mainImage).width(1200).height(675).url()} 
             alt={post.title ?? "Post image"} 
             className="w-full h-full object-cover"
           />
        </div>
      )}

      <GlassCard className="p-8 md:p-10 prose prose-neutral dark:prose-invert max-w-none prose-lg prose-headings:font-bold prose-headings:tracking-tight prose-a:text-accent prose-img:rounded-xl">
        {post.body ? <PortableText value={post.body} /> : <p>No content yet.</p>}
      </GlassCard>
    </div>
  );
}

