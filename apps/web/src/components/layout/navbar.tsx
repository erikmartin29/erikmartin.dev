"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "HOME" },
  { href: "/about", label: "ABOUT" },
  { href: "/work", label: "WORK" },
  { href: "/blog", label: "BLOG" },
];

const BOOK_TIME_URL = "https://cal.com/erikmartin";

export function Navbar() {
  const pathname = usePathname();

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b"
      style={{ backgroundColor: "var(--background)", borderColor: "var(--guideline)" }}
    >
      <div className="mx-auto px-4 md:px-6 flex items-center justify-between" style={{ height: '75px', maxWidth: "var(--max-content-width)" }}>
        <nav className="flex items-center gap-6 md:gap-8">
          {NAV_LINKS.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(`${link.href}/`));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "font-mono text-[13px] tracking-wide transition-colors duration-150",
                  isActive
                    ? "font-medium text-foreground"
                    : "font-light text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <a
          href={BOOK_TIME_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[13px] tracking-wide border border-border px-4 py-1.5 transition-opacity hover:opacity-70 bg-foreground text-background"
        >
          BOOK TIME
        </a>
      </div>
    </header>
  );
}
