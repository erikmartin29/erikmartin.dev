"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { CursorTarget } from "@/components/cursor-target";

type AnimationState = "closed" | "hover";

export function WorkFolderLink() {
  const [animationState, setAnimationState] = useState<AnimationState>("closed");

  const handleMouseEnter = useCallback(() => {
    setAnimationState("hover");
  }, []);

  const handleMouseLeave = useCallback(() => {
    setAnimationState("closed");
  }, []);

  return (
    <CursorTarget variant="read-more" text="VIEW WORK" icon="arrow-right">
      <Link
        href="/work"
        className="block cursor-pointer group relative w-32 h-[110px] mx-auto isolate perspective-[1000px]"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Folder base SVG - stays visible when closed, fades when flap opens */}
        <motion.svg
          className="absolute inset-x-0 bottom-0 w-full h-[100px] z-0"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          shapeRendering="geometricPrecision"
          style={{ isolation: "isolate" }}
        >
          <path
            d="M8,0 L30,0 L36,4 L92,4 Q100,4 100,12 L100,92 Q100,100 92,100 L8,100 Q0,100 0,92 L0,32 L10.5,32 L10.5,8 L8,0 Z"
            fill="hsl(187, 100%, 26%)"
          />
          <path
            d="M0,6 A6 6 0 0 1 6 0 L8,0 Q10,2 10.5,6 L10.5,32 L0,32 Z"
            fill="hsl(187, 100%, 26%)"
          />
        </motion.svg>

        {[
          { color: "bg-white", rotate: -3, z: 12 },
          { color: "bg-white", rotate: 0, z: 11 },
          { color: "bg-white", rotate: 3, z: 10 },
        ].map((page, i) => (
          <motion.div
            key={i}
            className={`absolute inset-x-4 bottom-3 h-[70px] z-10 rounded-lg border border-foreground/10 origin-bottom ${page.color}`}
            style={{ zIndex: page.z }}
            initial={false}
            animate={{
              y: animationState === "hover" ? -18 - i * 4 : 0,
              scale: animationState === "hover" ? 1 : 0.98,
              rotate: animationState === "hover" ? page.rotate : 0,
              opacity: animationState === "hover" ? 1 : 0.9,
              transition: {
                duration: 0.22,
                ease: "easeOut",
                delay: i * 0.03,
              },
            }}
          />
        ))}

        {/* Folder flap - opens on hover, rotates around bottom edge */}
        <motion.div
          className="absolute inset-x-0 bottom-0 h-[95px] z-20 pointer-events-none"
          initial={false}
          animate={{
            rotateX: animationState === "hover" ? -18 : 0,
            transition: { duration: 0.25, ease: "easeInOut" },
          }}
          style={{
            transformOrigin: "50% 100%",
            transformStyle: "preserve-3d",
            willChange: "transform",
          }}
        >
          <div
            className="w-full h-full rounded-lg overflow-hidden border border-foreground/10"
            style={{
              background: "linear-gradient(to bottom, var(--accent) 0%, hsl(187, 100%, 32%) 100%)",
            }}
          />
        </motion.div>
      </Link>
    </CursorTarget>
  );
}
