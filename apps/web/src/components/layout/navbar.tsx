"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
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
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b md:h-[75px] h-12"
      style={{ backgroundColor: "var(--background)", borderColor: "var(--guideline)" }}
    >
      <div
        className="mx-auto px-4 md:px-6 flex items-center justify-between h-full"
        style={{ maxWidth: "var(--max-content-width)" }}
      >
        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 md:gap-8">
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

        {/* Desktop CTA */}
        <a
          href={BOOK_TIME_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex font-mono text-[13px] rounded-full tracking-wide border border-border px-4 py-1.5 transition-opacity hover:opacity-70 bg-foreground text-background"
        >
          BOOK TIME
        </a>

        {/* Mobile only: hamburger */}
        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          className="flex md:hidden p-2 -m-2 text-foreground"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile only: dropdown menu */}
      {mobileOpen && (
        <div
          className="flex md:hidden absolute top-12 left-0 right-0 border-b py-4 px-4 flex-col gap-1"
          style={{ backgroundColor: "var(--background)", borderColor: "var(--guideline)" }}
        >
          {NAV_LINKS.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(`${link.href}/`));

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "font-mono text-[13px] tracking-wide py-2 px-2 -mx-2 rounded transition-colors",
                  isActive
                    ? "font-medium text-foreground"
                    : "font-light text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <a
            href={BOOK_TIME_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileOpen(false)}
            className="font-mono text-[13px] rounded-full tracking-wide border border-border px-4 py-2 mt-2 w-fit transition-opacity hover:opacity-70 bg-foreground text-background"
          >
            BOOK TIME
          </a>
        </div>
      )}
    </header>
  );
}
