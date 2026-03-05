"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

interface ProjectCardProps {
  title: string;
  tagline?: string;
  year?: string;
  slug: string;
  thumbnailUrl?: string;
  videoUrl?: string;
}

export function ProjectCard({
  title,
  tagline,
  year,
  slug,
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

  return (
    <Link href={`/work/${slug}`} className="group block">
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

      <div
        className="relative left-1/2 w-screen -translate-x-1/2"
        style={{ height: "1px", backgroundColor: "var(--guideline)" }}
        aria-hidden
      />

      <div className="flex flex-col gap-0.5 mt-2 p-2">
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-sm font-bold text-foreground">{title}</span>
          {year && (
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground shrink-0">
              {year}
            </span>
          )}
        </div>
        {tagline && (
          <p className="text-xs text-muted-foreground">{tagline}</p>
        )}
      </div>
    </Link>
  );
}
