"use client";

import { useEffect, useState, useCallback, useRef, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
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

type CursorState = "default" | "click" | "pill" | "text";

const TEXT_LEAVE_DELAY_MS = 120;

function isPointInRect(
  x: number,
  y: number,
  rect: DOMRect,
  tolerance = 8
): boolean {
  return (
    x >= rect.left - tolerance &&
    x <= rect.right + tolerance &&
    y >= rect.top - tolerance &&
    y <= rect.bottom + tolerance
  );
}

const DEFAULT_TEXT_CURSOR_HEIGHT = 18;
const MIN_TEXT_CURSOR_HEIGHT = 14;
const MAX_TEXT_CURSOR_HEIGHT = 48;

function getTextHoverInfo(clientX: number, clientY: number): {
  overText: boolean;
  height: number;
} {
  const doc = document;
  const el = doc.elementFromPoint(clientX, clientY);
  if (!el) return { overText: false, height: DEFAULT_TEXT_CURSOR_HEIGHT };

  const tag = (el as HTMLElement).tagName?.toLowerCase();
  if (tag === "input" || tag === "textarea") {
    const rect = (el as HTMLElement).getBoundingClientRect();
    return { overText: true, height: rect.height };
  }
  if ((el as HTMLElement).isContentEditable || el.closest?.('[contenteditable="true"]')) {
    // Try caret API for line height; fallback to element height
    if (typeof doc.caretRangeFromPoint === "function") {
      try {
        const range = doc.caretRangeFromPoint(clientX, clientY);
        if (range?.startContainer) {
          const rect = range.getBoundingClientRect();
          if (rect.height > 0) return { overText: true, height: rect.height };
        }
      } catch {
        // ignore
      }
    }
    const target = el.closest('[contenteditable="true"]') ?? el;
    const rect = (target as HTMLElement).getBoundingClientRect();
    return { overText: true, height: rect.height };
  }
  if (el.closest?.('input, textarea')) {
    const target = el.closest('input, textarea') as HTMLElement;
    const rect = target?.getBoundingClientRect();
    return { overText: true, height: rect?.height ?? DEFAULT_TEXT_CURSOR_HEIGHT };
  }
  if (typeof getComputedStyle !== "undefined") {
    const style = getComputedStyle(el);
    if (style.cursor === "text") {
      const rect = (el as HTMLElement).getBoundingClientRect();
      return { overText: true, height: rect.height };
    }
  }

  // caretRangeFromPoint returns nearest text even when over empty space -
  // verify the point is actually within the text bounds; use rect height for line height
  if (typeof doc.caretRangeFromPoint === "function") {
    try {
      const range = doc.caretRangeFromPoint(clientX, clientY);
      if (!range?.startContainer) return { overText: false, height: DEFAULT_TEXT_CURSOR_HEIGHT };
      const rect = range.getBoundingClientRect();
      if (!isPointInRect(clientX, clientY, rect)) return { overText: false, height: DEFAULT_TEXT_CURSOR_HEIGHT };
      return { overText: true, height: rect.height || DEFAULT_TEXT_CURSOR_HEIGHT };
    } catch {
      // ignore
    }
  }
  const docWithCaret = doc as Document & {
    caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node; offset?: number } | null;
  };
  if (typeof docWithCaret.caretPositionFromPoint === "function") {
    try {
      const pos = docWithCaret.caretPositionFromPoint(clientX, clientY);
      if (!pos?.offsetNode) return { overText: false, height: DEFAULT_TEXT_CURSOR_HEIGHT };
      const range = doc.createRange();
      range.setStart(pos.offsetNode, pos.offset ?? 0);
      range.collapse(true);
      const rect = range.getBoundingClientRect();
      if (!isPointInRect(clientX, clientY, rect)) return { overText: false, height: DEFAULT_TEXT_CURSOR_HEIGHT };
      return { overText: true, height: rect.height || DEFAULT_TEXT_CURSOR_HEIGHT };
    } catch {
      // ignore
    }
  }
  return { overText: false, height: DEFAULT_TEXT_CURSOR_HEIGHT };
}

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
  const pathname = usePathname();
  const isBlogContentPage = pathname?.startsWith("/blog/") ?? false;

  const [mounted, setMounted] = useState(false);
  const [cursorState, setCursorState] = useState<CursorState>("default");
  const [pillContent, setPillContent] = useState<{ text: string; icon: string } | null>(null);

  const lastPos = useRef({ x: 0, y: 0 });
  const textLeaveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [wasOverTextOnClick, setWasOverTextOnClick] = useState(false);
  const [textCursorHeight, setTextCursorHeight] = useState(DEFAULT_TEXT_CURSOR_HEIGHT);
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
    const textInfo = getTextHoverInfo(clientX, clientY);
    const isOverPostBodyOrTitle =
      !!el?.closest("[data-blog-post-body]") || !!el?.closest("[data-blog-post-title]");

    if (target) {
      if (textLeaveTimeout.current) {
        clearTimeout(textLeaveTimeout.current);
        textLeaveTimeout.current = null;
      }
      setPillContent(target);
      setCursorState((prev) => (prev === "click" ? "click" : "pill"));
    } else if (isBlogContentPage && isOverPostBodyOrTitle && textInfo.overText) {
      if (textLeaveTimeout.current) {
        clearTimeout(textLeaveTimeout.current);
        textLeaveTimeout.current = null;
      }
      setTextCursorHeight(textInfo.height);
      setPillContent(null);
      setCursorState((prev) => (prev === "click" ? "click" : "text"));
    } else {
      setPillContent(null);
      setCursorState((prev) => {
        if (prev === "click") return "click";
        if (prev === "text") {
          if (!textLeaveTimeout.current) {
            textLeaveTimeout.current = setTimeout(() => {
              textLeaveTimeout.current = null;
              setCursorState("default");
            }, TEXT_LEAVE_DELAY_MS);
          }
          return "text";
        }
        return "default";
      });
    }
  }, [isBlogContentPage]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset text mode when navigating away from blog content page
  useEffect(() => {
    if (!isBlogContentPage) {
      setCursorState((prev) => {
        if (prev === "text") {
          if (textLeaveTimeout.current) {
            clearTimeout(textLeaveTimeout.current);
            textLeaveTimeout.current = null;
          }
          return "default";
        }
        return prev;
      });
    }
  }, [isBlogContentPage]);

  useEffect(() => {
    if (!mounted) return;

    const handleMouseMove = (e: MouseEvent) => {
      updatePosition(e.clientX, e.clientY);
      updateHover(e.clientX, e.clientY);
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (textLeaveTimeout.current) {
        clearTimeout(textLeaveTimeout.current);
        textLeaveTimeout.current = null;
      }
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const isOverPostBodyOrTitle =
        !!el?.closest("[data-blog-post-body]") || !!el?.closest("[data-blog-post-title]");
      const textInfo = getTextHoverInfo(e.clientX, e.clientY);
      const overText = isBlogContentPage && isOverPostBodyOrTitle && textInfo.overText;
      setWasOverTextOnClick(overText);
      if (overText) setTextCursorHeight(textInfo.height);
      setCursorState("click");
    };
    const handleMouseUp = () => {
      const { x: px, y: py } = lastPos.current;
      const el = document.elementFromPoint(px, py);
      const target = getCursorTarget(el);
      const isOverPostBodyOrTitle =
        !!el?.closest("[data-blog-post-body]") || !!el?.closest("[data-blog-post-title]");
      const textInfo = getTextHoverInfo(px, py);
      setPillContent(target);
      if (target) setCursorState("pill");
      else if (isBlogContentPage && isOverPostBodyOrTitle && textInfo.overText) {
        setTextCursorHeight(textInfo.height);
        setCursorState("text");
      } else setCursorState("default");
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      if (textLeaveTimeout.current) {
        clearTimeout(textLeaveTimeout.current);
        textLeaveTimeout.current = null;
      }
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [mounted, isBlogContentPage, updatePosition, updateHover]);

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
  const isText =
    cursorState === "text" ||
    (cursorState === "click" && wasOverTextOnClick);

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
        className={`absolute left-0 top-1/2 flex origin-center items-center justify-center gap-1.5 overflow-hidden ${isText ? "rounded-none" : "rounded-full"}`}
        style={{
          background: "#000",
          color: "#fff",
          border: isPill ? "1px solid var(--background)" : "none",
        }}
        animate={{
          width: isPill ? pillWidth || 10 : isText ? 2 : 10,
          height: isPill
            ? 24
            : isText
              ? Math.min(MAX_TEXT_CURSOR_HEIGHT, Math.max(MIN_TEXT_CURSOR_HEIGHT, textCursorHeight))
              : 10,
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
