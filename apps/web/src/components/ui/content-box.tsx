"use client";

import { cn } from "@/lib/utils";
import { motion, useInView } from "framer-motion";
import { HTMLAttributes, useRef, useEffect, useState } from "react";

interface ContentBoxProps extends HTMLAttributes<HTMLDivElement> {
  innerClassName?: string;
  showBottomLine?: boolean;
  /** Set to true to skip the scroll-triggered transition (e.g. for top spacers) */
  noTransition?: boolean;
}

export function ContentBox({
  children,
  className,
  innerClassName,
  showBottomLine = false,
  noTransition = false,
  ...props
}: ContentBoxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-40px 0px -40px 0px",
    amount: 0.1,
  });
  const [fallbackShow, setFallbackShow] = useState(false);

  // Fallback: if Intersection Observer doesn't fire (e.g. element in view on load,
  // race conditions), ensure content appears.
  useEffect(() => {
    const checkAndShow = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
      if (inViewport) setFallbackShow(true);
    };
    const timer = setTimeout(checkAndShow, 150);
    const safetyTimer = setTimeout(checkAndShow, 800); // Safety net for stubborn cases
    return () => {
      clearTimeout(timer);
      clearTimeout(safetyTimer);
    };
  }, []);

  const shouldAnimate = isInView || fallbackShow;

  const box = (
    <div
      className={cn(
        "w-full border-t border-guideline",
        showBottomLine && "border-b border-guideline -mb-px",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "w-full mx-auto px-[15px] py-[15px]",
          innerClassName
        )}
        style={{ maxWidth: "var(--max-content-width)" }}
      >
        {children}
      </div>
    </div>
  );

  if (noTransition) return box;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
      transition={{
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {box}
    </motion.div>
  );
}
