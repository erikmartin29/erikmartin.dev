"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ContactButtonProps {
  href: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  target?: string;
  rel?: string;
}

export function ContactButton({ 
  href, 
  children, 
  size = "md", 
  variant = "secondary",
  className,
  target,
  rel
}: ContactButtonProps) {
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={cn(
        "relative inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 active:scale-95 overflow-hidden",
        
        // Variants
        variant === "primary" && [
          "bg-accent/80 text-white backdrop-blur-sm border-white/20",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_4px_8px_rgba(0,149,168,0.3)]",
          "hover:bg-accent hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_6px_12px_rgba(0,149,168,0.4)] hover:-translate-y-0.5",
        ],
        
        variant === "secondary" && [
          "bg-white/10 text-foreground backdrop-blur-md",
          "border border-white/20 border-t-white/30 border-b-black/10",
          "shadow-[inset_0_0_10px_rgba(255,255,255,0.05)]",
          "hover:bg-white/20 hover:border-white/30"
        ],
          
        variant === "ghost" && 
          "bg-transparent hover:bg-white/10 text-foreground",

        // Sizes
        size === "sm" && "h-9 px-4 text-sm",
        size === "md" && "h-11 px-6 text-base",
        size === "lg" && "h-14 px-8 text-lg",
        
        className
      )}
    >
      {/* Glossy Shine Overlay */}
      {variant !== "ghost" && (
        <div className="absolute inset-x-0 top-0 h-[50%] bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
      )}
      
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </a>
  );
}