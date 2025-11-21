import Link from "next/link";
import { Github, Linkedin, Twitter } from "lucide-react";
import { sanityFetch } from "@/sanity/live";
import { FOOTER_QUERY } from "@/sanity/queries";
import type { FOOTER_QUERYResult } from "@/sanity/sanity.types";
import { ModeToggle } from "../mode-toggle";

export async function Footer() {
  const currentYear = new Date().getFullYear();
  const { data: profile } = await sanityFetch<FOOTER_QUERYResult>({
    query: FOOTER_QUERY,
  });

  return (
    <footer className="relative z-10 mt-auto pb-6 px-4 flex justify-center pointer-events-none">
      <div 
        className="pointer-events-auto max-w-5xl w-full mx-auto glass-panel rounded-full h-[60px] px-2 flex items-center justify-between border border-black/5 dark:border-white/10 hover:scale-[1.01] transition-transform"
        style={{ boxShadow: "0 8px 30px rgba(0, 0, 0, 0.06)" }}
      >
        <div className="flex items-center px-3 gap-2 text-sm font-medium">
          <span className="text-muted-foreground">© {currentYear}</span>
          <Link href="/" className="font-bold hover:text-accent transition-colors">
            Erik Martin<span className="text-accent">.</span>
          </Link>
        </div>

        <ModeToggle />
      </div>
    </footer>
  );
}
