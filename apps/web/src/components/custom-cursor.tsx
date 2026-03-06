"use client";

import { useEffect, useState, useCallback, useRef, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  ExternalLink,
  ArrowRight,
  FileText,
  Github,
  type LucideIcon,
} from "lucide-react";

/** Icon names that can be passed via data-cursor-icon */
const ICON_MAP: Record<string, LucideIcon> = {
  eye: Eye,
  "external-link": ExternalLink,
  "arrow-right": ArrowRight,
  "file-text": FileText,
  github: Github,
};

/** Preset variants: text + icon */
export const CURSOR_VARIANTS = {
  "case-study": { text: "VIEW CASE STUDY", icon: "eye" },
  project: { text: "VIEW PROJECT", icon: "eye" },
  link: { text: "VIEW", icon: "external-link" },
  "read-more": { text: "READ MORE", icon: "arrow-right" },
  resume: { text: "DOWNLOAD", icon: "file-text" },
  github: { text: "VIEW GITHUB", icon: "github" },
} as const;

type CursorState = "default" | "click" | "pill";

function getCursorTarget(el: Element | null): {
  text: string;
  icon: string;
} | null {
  if (!el) return null;
  const target = el.closest("[data-cursor-text]");
  if (!target) return null;
  const text = target.getAttribute("data-cursor-text");
  const icon = target.getAttribute("data-cursor-icon") ?? "eye";
  if (!text) return null;
  return { text, icon };
}

export function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [cursorState, setCursorState] = useState<CursorState>("default");
  const [pillContent, setPillContent] = useState<{ text: string; icon: string } | null>(null);

  const lastPos = useRef({ x: 0, y: 0 });
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const measureRef = useRef<HTMLDivElement>(null);
  const [pillWidth, setPillWidth] = useState(0);

  const updatePosition = useCallback((clientX: number, clientY: number) => {
    lastPos.current = { x: clientX, y: clientY };
    setPos({ x: clientX, y: clientY });
  }, []);

  const updateHover = useCallback((clientX: number, clientY: number) => {
    const el = document.elementFromPoint(clientX, clientY);
    const target = getCursorTarget(el);
    if (target) {
      setPillContent(target);
      setCursorState((prev) => (prev === "click" ? "click" : "pill"));
    } else {
      setPillContent(null);
      setCursorState((prev) => (prev === "click" ? "click" : "default"));
    }
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const handleMouseMove = (e: MouseEvent) => {
      updatePosition(e.clientX, e.clientY);
      updateHover(e.clientX, e.clientY);
    };

    const handleMouseDown = () => setCursorState("click");
    const handleMouseUp = () => {
      const { x: px, y: py } = lastPos.current;
      const el = document.elementFromPoint(px, py);
      const target = getCursorTarget(el);
      setPillContent(target);
      setCursorState(target ? "pill" : "default");
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [mounted, updatePosition, updateHover]);

  // Only show on pointer devices (not touch)
  const [hasPointer, setHasPointer] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    setHasPointer(mq.matches);
    const handler = () => setHasPointer(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Measure pill content width for dynamic sizing
  useLayoutEffect(() => {
    if (cursorState !== "pill" || !pillContent) {
      setPillWidth(0);
      return;
    }
    const el = measureRef.current;
    if (!el) return;

    const measure = () => {
      const w = Math.max(el.offsetWidth, el.scrollWidth) + 2;
      setPillWidth(w);
    };

    measure();
    const raf = requestAnimationFrame(measure);

    const observer = new ResizeObserver(measure);
    observer.observe(el);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [cursorState, pillContent]);

  useEffect(() => {
    if (mounted && hasPointer) {
      document.documentElement.classList.add("custom-cursor-active");
      document.body.classList.add("custom-cursor-active");
      return () => {
        document.documentElement.classList.remove("custom-cursor-active");
        document.body.classList.remove("custom-cursor-active");
      };
    }
  }, [mounted, hasPointer]);

  if (!mounted || !hasPointer) return null;

  const IconComponent = pillContent
    ? ICON_MAP[pillContent.icon] ?? Eye
    : Eye;

  const isPill = cursorState === "pill" && pillContent;

  return (
    <motion.div
      className="fixed top-0 left-0 w-0 h-0 pointer-events-none"
      style={{
        x: pos.x,
        y: pos.y,
        zIndex: 2147483647,
      }}
    >
      {isPill && (
        <div
          ref={measureRef}
          className="absolute left-0 top-1/2 -translate-y-1/2 inline-flex w-fit items-center justify-start gap-1.5 rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wide whitespace-nowrap"
          style={{
            visibility: "hidden",
            pointerEvents: "none",
          }}
          aria-hidden
        >
          <IconComponent className="w-2.5 h-2.5 shrink-0" strokeWidth={2} />
          {pillContent?.text}
        </div>
      )}

      <motion.div
        className="absolute left-0 top-1/2 flex origin-center items-center justify-center gap-1.5 overflow-hidden rounded-full"
        style={{
          background: "#000",
          color: "#fff",
          border: "1px solid var(--background)",
        }}
        animate={{
          width: isPill ? pillWidth || 10 : 10,
          height: isPill ? 24 : 10,
          paddingLeft: isPill ? 8 : 0,
          paddingRight: isPill ? 8 : 0,
          opacity: cursorState === "click" ? 0.5 : 1,
          x: "-50%",
          y: "-50%",
          scale: cursorState === "click" ? 1.15 : 1,
        }}
        transition={{
          width: { duration: 0.15, ease: [0.25, 0.46, 0.45, 0.94] },
          height: { duration: 0.15, ease: [0.25, 0.46, 0.45, 0.94] },
          paddingLeft: { duration: 0.15 },
          paddingRight: { duration: 0.15 },
          scale: { duration: 0.1, ease: "easeOut" },
          opacity: { duration: 0.1 },
        }}
      >
        <AnimatePresence mode="wait">
          {isPill && pillContent ? (
            <motion.span
              key="content"
              className="flex items-center gap-1.5 whitespace-nowrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <IconComponent className="w-2.5 h-2.5 shrink-0" strokeWidth={2} />
              <span className="text-[10px] font-bold uppercase tracking-wide">
                {pillContent.text}
              </span>
            </motion.span>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
