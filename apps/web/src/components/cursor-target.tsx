"use client";

import React from "react";
import { CURSOR_VARIANTS } from "./custom-cursor";

type CursorVariant = keyof typeof CURSOR_VARIANTS;

interface CursorTargetProps {
  children: React.ReactNode;
  /** Preset variant - use this for common cases to avoid repeating text/icon */
  variant?: CursorVariant;
  /** Custom text (overrides variant) */
  text?: string;
  /** Custom icon name: eye | external-link | arrow-right | file-text (overrides variant) */
  icon?: string;
  /** When true, merges data attributes onto the single child instead of wrapping */
  asChild?: boolean;
}

/**
 * Wraps content and adds cursor pill behavior on hover.
 * Use `variant` for common cases (case-study, link, read-more, resume) - no need to pass text/icon every time.
 * Override with `text` and/or `icon` when you need something different.
 */
export function CursorTarget({
  children,
  variant = "case-study",
  text,
  icon,
  asChild = true,
}: CursorTargetProps) {
  const preset = CURSOR_VARIANTS[variant];
  const finalText = text ?? preset.text;
  const finalIcon = icon ?? preset.icon;

  const dataProps = {
    "data-cursor-text": finalText,
    "data-cursor-icon": finalIcon,
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
      ...(children.props as Record<string, unknown>),
      ...dataProps,
    });
  }

  return (
    <span {...dataProps} className="inline-block">
      {children}
    </span>
  );
}
