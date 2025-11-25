"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { urlFor } from "@/sanity/client";
import type { HOME_QUERYResult } from "@/sanity/sanity.types";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";

type SkillCardProps = {
  skill: HOME_QUERYResult["skills"][number];
};

export function SkillCard({ skill }: SkillCardProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const logo = mounted && resolvedTheme === "dark" ? skill.logoDark : skill.logoLight;

  const CardContent = (
    <GlassCard className="p-3 hover:scale-110 transition-transform duration-200 cursor-pointer flex items-center justify-center">
      {logo ? (
        <div className="relative w-12 h-12">
          <Image
            src={urlFor(logo).width(100).height(100).url()}
            alt={skill.name || "Skill Logo"}
            width={96}
            height={96}
          />
        </div>
      ) : (
        <div className="w-12 h-12 flex items-center justify-center text-2xl font-bold text-muted-foreground">
          ?
        </div>
      )}
    </GlassCard>
  );

  return skill.link ? (
    <a href={skill.link} target="_blank" rel="noopener noreferrer">
      {CardContent}
    </a>
  ) : (
    <div>{CardContent}</div>
  );
}

