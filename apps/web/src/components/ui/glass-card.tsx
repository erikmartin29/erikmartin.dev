import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "hover";
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", children, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "glass-panel rounded-2xl border border-white/20 p-4  transition-all duration-300",
          variant === "hover" && "hover:bg-white/10 hover:scale-[1.02] hover:shadow-lg cursor-pointer",
          className
        )}
        style={{
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.06)", // Force neutral gray shadow inline
          ...style
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = "GlassCard";
