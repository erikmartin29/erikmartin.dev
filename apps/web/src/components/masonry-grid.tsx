import { Children, type ReactNode } from "react";
import { cn } from "@/lib/utils";

function chunk<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

function FullWidthGuideline() {
  return (
    <div
      aria-hidden
      className="relative left-1/2 w-screen -translate-x-1/2"
      style={{ height: "1px", backgroundColor: "var(--guideline)" }}
    />
  );
}

interface ProjectGridProps {
  children: ReactNode;
  className?: string;
}

export function ProjectGrid({ children, className }: ProjectGridProps) {
  const items = Children.toArray(children);
  const rows = chunk(items, 2);

  return (
    <div className={cn("flex flex-col", className)}>
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex flex-col">
          <div
        className="relative left-1/2 w-screen -translate-x-1/2"
        style={{ height: "1px", backgroundColor: "var(--guideline)" }}
        aria-hidden
      />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-8">
            {row}
          </div>
        </div>
      ))}
    </div>
  );
}
