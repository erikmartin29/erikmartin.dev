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
}
