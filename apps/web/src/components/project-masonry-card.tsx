"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { CursorTarget } from "@/components/cursor-target";

const HOVER_DELAY_MS = 0;
const TRANSITION_DURATION_MS = 200;

interface ProjectCardProps {
  title: string;
  tagline?: string;
  /** When set, card links to blog post; when unset, card is not clickable */
  blogSlug?: string;
  thumbnailUrl?: string;
  videoUrl?: string;
}

export function ProjectCard({
  title,
  tagline,
  blogSlug,
  thumbnailUrl,
  videoUrl,
}: ProjectCardProps) {
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = useCallback(() => {
    hoverTimeoutRef.current = setTimeout(() => {
      setVideoReady(true);
      videoRef.current?.play();
    }, HOVER_DELAY_MS);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setVideoReady(false);
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const content = (
    <>
      <div
        className="relative aspect-4/3 overflow-hidden"
        onMouseEnter={videoUrl ? handleMouseEnter : undefined}
        onMouseLeave={videoUrl ? handleMouseLeave : undefined}
      >
        {videoUrl && (
          <video
            ref={videoRef}
            src={videoUrl}
            loop
            muted
            playsInline
            className={`absolute inset-0 z-0 w-full h-full object-cover transition-opacity ease-out ${
              videoReady ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDuration: `${TRANSITION_DURATION_MS}ms` }}
          />
        )}

        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={`z-10 object-cover transition-all ease-out group-hover:scale-[1.08] ${
              videoUrl && videoReady
                ? "opacity-0 pointer-events-none"
                : "opacity-100"
            }`}
            style={{ transitionDuration: `${TRANSITION_DURATION_MS}ms` }}
          />
        ) : !videoUrl ? (
          <div className="absolute inset-0 z-10 bg-foreground/5 flex items-center justify-center text-muted-foreground text-sm">
            No Preview
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-0.5 mt-2 px-2 pb-2">
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-sm font-bold text-foreground flex items-baseline gap-2">
            {title}
          </span>
        </div>
        {tagline && (
          <p className="text-xs text-muted-foreground/80 font-mono">{tagline}</p>
        )}
      </div>
    </>
  );

  if (blogSlug) {
    return (
      <CursorTarget variant="project">
        <Link href={`/blog/${blogSlug}`} className="group block pb-5">
          {content}
        </Link>
      </CursorTarget>
    );
  }
  return <div className="group block pb-5 cursor-default">{content}</div>;
}
