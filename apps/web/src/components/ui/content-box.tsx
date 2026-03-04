import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface ContentBoxProps extends HTMLAttributes<HTMLDivElement> {
  innerClassName?: string;
  showBottomLine?: boolean;
}

export function ContentBox({
  children,
  className,
  innerClassName,
  showBottomLine = false,
  ...props
}: ContentBoxProps) {
  return (
    <div
      className={cn(
        "w-full border-t border-guideline",
        showBottomLine && "border-b border-guideline",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "mx-auto px-4 md:px-6 py-[15px]",
          innerClassName
        )}
        style={{ maxWidth: "var(--max-content-width)" }}
      >
        {children}
      </div>
    </div>
  );
}
