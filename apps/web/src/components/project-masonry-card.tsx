"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

interface ProjectCardProps {
  title: string;
  tagline?: string;
  year?: string;
  /** When set, card links to blog post; when unset, card is not clickable */
  blogSlug?: string;
  thumbnailUrl?: string;
  videoUrl?: string;
}

export function ProjectCard({
  title,
  tagline,
  year,
  blogSlug,
  thumbnailUrl,
  videoUrl,
}: ProjectCardProps) {
  const [hovered, setHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = useCallback(() => {
    setHovered(true);
    videoRef.current?.play();
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  }, []);

  const content = (
    <>
      <div
        className="relative aspect-4/3 overflow-hidden"
        onMouseEnter={videoUrl ? handleMouseEnter : undefined}
        onMouseLeave={videoUrl ? handleMouseLeave : undefined}
      >
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={`object-cover transition-transform duration-300 group-hover:scale-[1.02] ${
              videoUrl && hovered ? "invisible" : ""
            }`}
          />
        ) : !videoUrl ? (
          <div className="absolute inset-0 bg-foreground/5 flex items-center justify-center text-muted-foreground text-sm">
            No Preview
          </div>
        ) : null}

        {videoUrl && (
          <video
            ref={videoRef}
            src={videoUrl}
            loop
            muted
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              hovered ? "opacity-100" : "opacity-0"
            }`}
          />
        )}
      </div>

      <div className="flex flex-col gap-0.5 mt-2 px-2 pb-2">
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-sm font-bold text-foreground">{title}</span>
          {year && (
            <span className="text-sm font-mono text-muted-foreground/50 uppercase tracking-wider shrink-0">
              {year}
            </span>
          )}
        </div>
        {tagline && (
          <p className="text-xs text-muted-foreground/80 font-mono">{tagline}</p>
        )}
      </div>
    </>
  );

  if (blogSlug) {
    return (
      <Link href={`/blog/${blogSlug}`} className="group block pb-5">
        {content}
      </Link>
    );
  }
  return <div className="group block pb-5 cursor-default">{content}</div>;
}
