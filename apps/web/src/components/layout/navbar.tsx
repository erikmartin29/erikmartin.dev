"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, NotebookPen, Mail, Home } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";

const NAV_LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/projects", label: "Projects", icon: Briefcase },
  { href: "/blog", label: "Blog", icon: NotebookPen },
  { href: "/contact", label: "Contact", icon: Mail },
];

export function Navbar() {
  const pathname = usePathname();
  const activeIndex = NAV_LINKS.findIndex((link) => link.href === pathname);
  const hasActive = activeIndex !== -1;
  const TAB_WIDTH = 40;
  const GAP = 4;
  const pillX = hasActive ? activeIndex * (TAB_WIDTH + GAP) : 0;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4 md:p-6 pointer-events-none">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        {/* Full Name Logo - Left */}
        <Link 
          href="/" 
          className="pointer-events-auto glass-panel flex items-center justify-center px-6 h-[60px] rounded-full hover:scale-[1.02] transition-all"
          style={{ boxShadow: "0 8px 30px rgba(0, 0, 0, 0.06)" }}
        >
          <span className="text-lg font-bold tracking-tight">
            Erik Martin<span className="text-accent">.</span>
          </span>
        </Link>

        {/* Navigation Links - Right */}
        <div 
          className="pointer-events-auto glass-panel flex items-center rounded-full h-[60px] p-2 px-3 gap-2"
          style={{ boxShadow: "0 8px 30px rgba(0, 0, 0, 0.06)" }}
        >
          <nav className="flex items-center gap-1 relative">
            <motion.div
              className="absolute top-0 bottom-0 left-0 w-10 bg-accent rounded-full z-10"
              initial={false}
              animate={{
                x: pillX,
                opacity: hasActive ? 1 : 0
              }}
              transition={{
                type: "spring",
                stiffness: 2000,
                damping: 60,
              }}
            />

            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative z-10 flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-200",
                    isActive ? "text-accent-foreground" : "text-muted-foreground hover:text-foreground hover:bg-white/10"
                  )}
                  aria-label={link.label}
                >
                  <Icon size={18} strokeWidth={2} />
                </Link>
              );
            })}
          </nav>
          
          {/* Theme Toggle */}
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
