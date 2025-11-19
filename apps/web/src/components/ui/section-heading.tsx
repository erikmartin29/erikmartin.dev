import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface SectionHeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
}

export function SectionHeading({ 
  title, 
  subtitle, 
  align = "center", 
  className,
  ...props 
}: SectionHeadingProps) {
  return (
    <div className={cn(
      "mb-12 flex flex-col gap-2", 
      align === "center" && "items-center text-center",
      align === "right" && "items-end text-right",
      className
    )}>
      <h2 
        className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70"
        {...props}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-muted-foreground max-w-[600px]">
          {subtitle}
        </p>
      )}
    </div>
  );
}

