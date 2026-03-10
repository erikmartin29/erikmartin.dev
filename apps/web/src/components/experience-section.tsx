"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { urlFor } from "@/sanity/client";
import type { HOME_QUERYResult } from "@/sanity/sanity.types";

type ExperienceItem = NonNullable<HOME_QUERYResult["experience"]>[number];
type ExperienceGroup = {
  company: string;
  companyUrl: string | null | undefined;
  logo: ExperienceItem["logo"];
  roles: ExperienceItem[];
};

interface ExperienceSectionProps {
  experienceGroups: ExperienceGroup[];
  resumeURL?: string | null;
}

// Geist Mono: ~0.6 char width per px (14px ≈ 8.4px/char, 12px ≈ 7.2px/char)
const PX_PER_CHAR_MOBILE = 7.2;
const PX_PER_CHAR_DESKTOP = 8.4;
const MIN_DASHES = 3;

function formatDate(role: ExperienceItem): string {
  const isSingleDate = role.dateDisplayType === "single" && role.singleDate;
  if (isSingleDate) {
    return new Date(role.singleDate!).getUTCFullYear().toString();
  }
  const startYear = role.startDate
    ? new Date(role.startDate).getUTCFullYear()
    : null;
  const endYear = role.endDate
    ? new Date(role.endDate).getUTCFullYear().toString()
    : "PRESENT";
  return startYear ? `${startYear}-${endYear}` : endYear;
}

function buildRoleLine(
  role: ExperienceItem,
  charsPerLine: number
): string {
  const title = (role.jobTitle ?? "").toUpperCase();
  const dateStr = formatDate(role).toUpperCase();
  const dashCount = Math.max(
    MIN_DASHES,
    charsPerLine - title.length - dateStr.length - 2
  );
  return `${title} ${"-".repeat(dashCount)} ${dateStr}`;
}

export function ExperienceSection({
  experienceGroups,
  resumeURL,
}: ExperienceSectionProps) {
  const textRef = useRef<HTMLDivElement>(null);
  const [charsPerLine, setCharsPerLine] = useState(49); // desktop default

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    const updateChars = () => {
      if (!el) return;
      const containerWidth = el.offsetWidth;
      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      // Subtract logo width + gap to get text area width
      const logoGap = isMobile ? 20 + 8 : 26 + 12;
      const textWidth = Math.max(0, containerWidth - logoGap);
      const pxPerChar = isMobile ? PX_PER_CHAR_MOBILE : PX_PER_CHAR_DESKTOP;
      const chars = Math.floor(textWidth / pxPerChar);
      setCharsPerLine(Math.max(20, chars));
    };

    updateChars();
    const ro = new ResizeObserver(updateChars);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={textRef} className="w-full max-w-[453px]">
      <div className="flex flex-col gap-0.5">
        {experienceGroups.map((group) => (
          <div key={group.company} className="flex gap-2 md:gap-3 items-start">
            {/* Company logo — scaled for mobile */}
            <div
              className="relative rounded shrink-0 mt-px overflow-hidden w-5 h-5 md:w-[26px] md:h-[26px]"
            >
              {group.logo?.asset && (
                <Image
                  src={urlFor(group.logo).width(52).height(52).url()}
                  alt={group.company}
                  fill
                  className="object-cover"
                />
              )}
            </div>

            {/* Company name + roles — responsive text size */}
            <div className="font-mono leading-snug text-[12px] md:text-[14px] min-w-0 flex-1">
              {group.companyUrl ? (
                <a
                  href={group.companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="m-0 inline-flex items-center gap-1 font-bold uppercase text-accent no-underline hover:underline [&>svg]:opacity-0 hover:[&>svg]:opacity-100 [&>svg]:text-accent transition-[text-decoration,opacity]"
                >
                  {group.company}
                </a>
              ) : (
                <p className="m-0 font-bold uppercase text-accent">
                  {group.company}
                </p>
              )}
              {group.roles.map((role) => (
                <p
                  key={role._id}
                  className="m-0 text-foreground/80 whitespace-nowrap"
                >
                  {buildRoleLine(role, charsPerLine)}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

      {resumeURL && (
        <div className="flex justify-center mt-4">
          <a
            href={resumeURL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center rounded-full border border-foreground/10 hover:border-foreground/50 font-mono text-[11px] md:text-[13px] uppercase text-foreground/80 hover:text-foreground transition-colors bg-transparent w-40 h-8 md:w-60 md:h-[31px]"
          >
            DOWNLOAD RESUME
          </a>
        </div>
      )}
    </div>
  );
}
