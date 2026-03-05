"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { ContentBox } from "@/components/ui/content-box";
import type { BLOG_QUERYResult } from "@/sanity/sanity.types";

interface BlogContentProps {
  posts: BLOG_QUERYResult;
}

export function BlogContent({ posts }: BlogContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach((post) => {
      post.categories?.forEach((cat) => {
        if (cat) tagSet.add(cat);
      });
    });
    return Array.from(tagSet).sort();
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        !searchQuery ||
        post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTag = !activeTag || post.categories?.includes(activeTag);

      return matchesSearch && matchesTag;
    });
  }, [posts, searchQuery, activeTag]);

  return (
    <>
      {/* Top spacer */}
      <ContentBox innerClassName="py-[75px]" />

      {/* Header: title, search, tags */}
      <ContentBox innerClassName="py-4">
        <h1 className="font-serif text-4xl font-bold mb-4">Blog</h1>

        <div className="relative mb-3">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              "w-full pl-9 pr-4 py-2 rounded-full text-sm font-mono",
              "bg-white/20 dark:bg-white/5 border border-foreground/10",
              "placeholder:text-muted-foreground text-foreground",
              "focus:outline-none focus:ring-1 focus:ring-accent/50",
              "transition-all duration-200"
            )}
          />
        </div>

        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTag(null)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-mono border transition-all duration-150",
                activeTag === null
                  ? "bg-foreground text-background border-foreground"
                  : "bg-white/20 dark:bg-white/5 border-foreground/10 text-muted-foreground hover:border-foreground/30 hover:text-foreground"
              )}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-mono border transition-all duration-150",
                  activeTag === tag
                    ? "bg-foreground text-background border-foreground"
                    : "bg-white/20 dark:bg-white/5 border-foreground/10 text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </ContentBox>

      {/* Article rows — each in its own ContentBox for full-width borders */}
      {filteredPosts.length === 0 ? (
        <ContentBox innerClassName="py-16" showBottomLine>
          <p className="text-center text-muted-foreground font-mono text-sm">
            No articles found.
          </p>
        </ContentBox>
      ) : (
        filteredPosts.map((post, i) => {
          const slug = post.slug?.current;
          if (!slug) return null;

          const category = post.categories?.[0];
          const formattedDate = post.publishedAt
            ? new Date(post.publishedAt)
                .toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })
                .toUpperCase()
            : null;

          return (
            <ContentBox
              key={post._id}
              className="group hover:bg-foreground/3 transition-colors duration-150"
              innerClassName="py-0"
              showBottomLine={i === filteredPosts.length - 1}
            >
              <Link href={`/blog/${slug}`} className="block py-5">
                <div className="flex items-center gap-3 mb-1.5">
                  {category && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono border border-foreground/10 text-muted-foreground uppercase tracking-wider">
                      {category}
                    </span>
                  )}
                  {formattedDate && (
                    <span className="text-xs font-mono text-muted-foreground/60 tracking-wide">
                      {formattedDate}
                    </span>
                  )}
                </div>

                <h2 className="font-mono font-bold text-base leading-snug group-hover:text-accent transition-colors duration-150 mb-1">
                  {post.title}
                </h2>

                {post.excerpt && (
                  <p className="text-sm font-mono text-muted-foreground line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                )}
              </Link>
            </ContentBox>
          );
        })
      )}
    </>
  );
}
