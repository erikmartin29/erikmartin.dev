import Link from "next/link";
import { Github, Linkedin, Twitter } from "lucide-react";
import { sanityFetch } from "@/sanity/live";
import { FOOTER_QUERY } from "@/sanity/queries";
import type { FOOTER_QUERYResult } from "@/sanity/sanity.types";

export async function Footer() {
  const currentYear = new Date().getFullYear();
  const { data: profile } = await sanityFetch<FOOTER_QUERYResult>({
    query: FOOTER_QUERY,
  });

  return (
    <footer className="relative z-10 mt-auto pb-6 px-4 flex justify-center pointer-events-none">
      <div 
        className="pointer-events-auto max-w-5xl w-full mx-auto glass-panel rounded-full h-[60px] px-6 flex items-center justify-between border border-black/5 dark:border-white/10 hover:scale-[1.01] transition-transform"
        style={{ boxShadow: "0 8px 30px rgba(0, 0, 0, 0.06)" }}
      >
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="text-muted-foreground">© {currentYear}</span>
          <Link href="/" className="font-bold hover:text-accent transition-colors">
            Erik Martin<span className="text-accent">.</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {profile?.socialLinks?.twitter && (
            <a 
              href={profile.socialLinks.twitter} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full"
              aria-label="Twitter"
            >
              <Twitter size={18} />
            </a>
          )}
          {profile?.socialLinks?.github && (
            <a 
              href={profile.socialLinks.github} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full"
              aria-label="GitHub"
            >
              <Github size={18} />
            </a>
          )}
          {profile?.socialLinks?.linkedin && (
            <a 
              href={profile.socialLinks.linkedin} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full"
              aria-label="LinkedIn"
            >
              <Linkedin size={18} />
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
