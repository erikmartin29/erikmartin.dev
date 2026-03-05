import { ContentBox } from "@/components/ui/content-box";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { sanityFetch } from "@/sanity/live";
import { POST_QUERY } from "@/sanity/queries";
import type { POST_QUERYResult } from "@/sanity/sanity.types";
import { PortableText } from "@portabletext/react";
import { urlFor } from "@/sanity/client";
import { notFound } from "next/navigation";

function estimateReadTime(body: POST_QUERYResult["body"]): number {
  if (!body) return 1;
  const text = body
    .flatMap((block) => block.children?.map((child) => child.text ?? "") ?? [])
    .join(" ");
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

function formatMetaDate(iso: string) {
  return new Date(iso)
    .toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })
    .toUpperCase();
}

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

  if (!post) notFound();

  const category = post.categories?.[0];
  const readTime = estimateReadTime(post.body);
  const publishedStr = post.publishedAt ? formatMetaDate(post.publishedAt) : null;
  const updatedStr = post._updatedAt ? formatMetaDate(post._updatedAt) : null;
  const showUpdated =
    updatedStr && publishedStr && updatedStr !== publishedStr;

  return (
    <>
      <ContentBox innerClassName="py-[75px]" />

      <ContentBox innerClassName="py-5" showBottomLine>
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors duration-150 mb-5 uppercase tracking-wider"
        >
          <ArrowLeft size={12} />
          Blog
        </Link>

        {/* Title */}
        <h1
          className="font-serif text-3xl md:text-4xl font-bold leading-tight tracking-tight mb-4"
          style={{ fontFamily: "var(--font-pt-serif), Georgia, serif" }}
        >
          {post.title}
        </h1>

        {/* Meta line */}
        <p className="font-mono text-xs text-muted-foreground/70 uppercase tracking-wide flex flex-wrap items-center gap-x-2 gap-y-1">
          {publishedStr && (
            <span>First Published: {publishedStr}</span>
          )}
          {showUpdated && (
            <>
              <span aria-hidden>·</span>
              <span>Last Updated: {updatedStr}</span>
            </>
          )}
          <span aria-hidden>·</span>
          <span>{readTime} min read</span>
        </p>

                {/* Category */}
                {category && (
          <div className="mb-3">
            <span className="px-2 py-0.5 rounded-sm text-[10px] font-mono bg-foreground text-background uppercase tracking-wider">
              {category}
            </span>
          </div>
        )}

      </ContentBox>

      {/* Hero image */}
      {post.mainImage && (
        <ContentBox innerClassName="py-0" showBottomLine>
          <img
            src={urlFor(post.mainImage).width(1200).height(500).url()}
            alt={post.title ?? "Post image"}
            className="w-full object-cover max-h-[420px]"
          />
        </ContentBox>
      )}

      {/* Body */}
      <ContentBox innerClassName="py-8" showBottomLine>
        <div className="prose prose-neutral dark:prose-invert max-w-none font-mono text-sm leading-relaxed prose-headings:font-serif prose-headings:font-bold prose-headings:tracking-tight prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-img:rounded-none prose-pre:rounded-none prose-pre:border prose-pre:border-foreground/10 prose-code:text-accent prose-code:font-mono prose-code:text-xs">
          {post.body ? <PortableText value={post.body} /> : <p>No content yet.</p>}
        </div>
      </ContentBox>
    </>
  );
}
