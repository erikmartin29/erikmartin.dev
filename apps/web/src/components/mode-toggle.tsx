"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { GlassButton } from "@/components/ui/glass-button";

export function ModeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  if (!mounted) {
    return (
      <GlassButton 
        variant="ghost" 
        size="sm" 
        className="w-10 h-10 rounded-full px-0 cursor-pointer"
        aria-label="Toggle theme"
      >
        <div className="w-[1.2rem] h-[1.2rem]" />
      </GlassButton>
    );
  }

  return (
    <GlassButton 
      variant="ghost" 
      size="sm" 
      className="w-10 h-10 rounded-full px-0 cursor-pointer"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      <div className="flex items-center justify-center">
        {resolvedTheme === "dark" ? (
          <Moon className="absolute h-[1.2rem] w-[1.2rem]" />
        ) : (
          <Sun className="absolute h-[1.2rem] w-[1.2rem]" />
        )}
      </div>
    </GlassButton>
  );
}
