"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Briefcase, NotebookPen, Mail, Home } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";
import { useEffect, useRef, useState } from "react";

const NAV_LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/projects", label: "Projects", icon: Briefcase },
  { href: "/blog", label: "Blog", icon: NotebookPen },
  { href: "/contact", label: "Contact", icon: Mail },
];

export function Navbar() {
  const pathname = usePathname();
  const [activeRect, setActiveRect] = useState({ left: 0, width: 0, opacity: 0 });
  const tabsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const activeIndex = NAV_LINKS.findIndex(link => link.href === pathname);
    const el = tabsRef.current[activeIndex];
    
    if (el) {
      setActiveRect({
        left: el.offsetLeft,
        width: el.offsetWidth,
        opacity: 1
      });
    } else {
      // Fallback if no match (e.g. 404) or not mounted
      setActiveRect(prev => ({ ...prev, opacity: 0 }));
    }
  }, [pathname]);

  // Handle resize to update pill position
  useEffect(() => {
    const handleResize = () => {
      const activeIndex = NAV_LINKS.findIndex(link => link.href === pathname);
      const el = tabsRef.current[activeIndex];
      if (el) {
        setActiveRect({
          left: el.offsetLeft,
          width: el.offsetWidth,
          opacity: 1
        });
      }
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [pathname]);

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
            {/* Active Pill - Absolute Positioned based on Active Tab */}
            <motion.div
              className="absolute top-0 bottom-0 bg-accent rounded-full -z-10"
              initial={false}
              animate={{
                left: activeRect.left,
                width: activeRect.width,
                opacity: activeRect.opacity
              }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30 
              }}
            />

            {NAV_LINKS.map((link, index) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  ref={el => { tabsRef.current[index] = el }}
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
