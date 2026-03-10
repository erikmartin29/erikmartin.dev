import { ContentBox } from "@/components/ui/content-box";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { sanityFetch } from "@/sanity/live";
import { POST_QUERY } from "@/sanity/queries";
import type { POST_QUERYResult } from "@/sanity/sanity.types";
import { PortableText } from "@portabletext/react";
import { projectPortableTextComponents } from "@/components/portable-text";
import { urlFor } from "@/sanity/client";
import { notFound } from "next/navigation";

function estimateReadTime(body: NonNullable<POST_QUERYResult>["body"]): number {
  if (!body) return 1;
  const text = body
    .flatMap((block) =>
      "children" in block && Array.isArray(block.children)
        ? block.children.map((child) => ("text" in child ? child.text ?? "" : ""))
        : []
    )
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

  const categories = (post.categories ?? []).filter((c): c is string => c != null);
  const readTime = estimateReadTime(post.body);
  const publishedStr = post.publishedAt ? formatMetaDate(post.publishedAt) : null;
  const updatedStr = post._updatedAt ? formatMetaDate(post._updatedAt) : null;
  const showUpdated =
    updatedStr && publishedStr && updatedStr !== publishedStr;

  return (
    <>
      <ContentBox className="hidden md:block" innerClassName="py-[75px]" noTransition />

      <ContentBox innerClassName="py-5" >
      <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground/50 hover:text-foreground transition-colors duration-150 uppercase tracking-wider"
        >
          <ArrowLeft size={12} />
          <span className="text-xs">Back to Blog</span>
        </Link>


        {/* Title */}
        <h1
          className="font-serif text-3xl md:text-4xl font-bold leading-tight tracking-tight mb-1"
          style={{ fontFamily: "var(--font-pt-serif), Georgia, serif" }}
        >
          {post.title}
        </h1>

        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-5">
          <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-x-2 font-mono text-xs text-muted-foreground/20 uppercase tracking-wide">
            <div className="flex flex-row items-center gap-x-2 flex-wrap md:flex-nowrap">
              {publishedStr && (
                <span>First Published: {publishedStr}</span>
              )}
              {showUpdated && (
                <>
                  <span aria-hidden className="hidden md:inline">·</span>
                  <span className="hidden md:inline">Last Updated: {updatedStr}</span>
                </>
              )}
              <span aria-hidden className="hidden md:inline">·</span>
              <span className="hidden md:inline">{readTime} min read</span>
            </div>
            {showUpdated && (
              <span className="md:hidden">Last Updated: {updatedStr}</span>
            )}
            <span className="md:hidden">{readTime} min read</span>
          </div>
          {categories.length > 0 && (
            <div className="flex flex-row flex-wrap gap-2 pl-0 md:pl-1">
              {categories.map((cat) => (
                <span
                  key={cat}
                  className="px-2 py-0.5 rounded-full text-[10px] font-mono border border-foreground/10 text-muted-foreground uppercase tracking-wider whitespace-nowrap"
                >
                  {cat}
                </span>
              ))}
            </div>
          )}
        </div>

        </ContentBox>

      {/* Body */}
      <ContentBox innerClassName="py-8" showBottomLine>
        <div data-blog-post-body className="prose prose-neutral dark:prose-invert max-w-none font-mono text-sm leading-relaxed prose-headings:font-serif prose-headings:font-bold prose-headings:tracking-tight prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-img:rounded-none prose-pre:rounded-none prose-pre:border prose-pre:border-foreground/10 prose-code:text-accent prose-code:font-mono prose-code:text-xs">
          {post.body ? (
            <PortableText
              value={post.body}
              components={projectPortableTextComponents}
            />
          ) : (
            <p>No content yet.</p>
          )}
        </div>
      </ContentBox>
    </>
  );
}
