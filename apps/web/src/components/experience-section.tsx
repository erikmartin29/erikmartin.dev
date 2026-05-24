import Image from "next/image";
import { urlFor } from "@/sanity/client";
import type { ExperienceGroup } from "@/lib/build-experience-groups";

interface ExperienceSectionProps {
  experienceGroups: ExperienceGroup[];
  resumeURL?: string | null;
}

function formatDate(role: ExperienceItem): string {
  const isSingleDate = role.dateDisplayType === "single" && role.singleDate;
  if (isSingleDate) {
    return new Date(role.singleDate!).getUTCFullYear().toString();
  }
  const startYear = role.startDate
    ? new Date(role.startDate).getUTCFullYear()
    : null;
  const endYear = role.endDate
    ? "-" + new Date(role.endDate).getUTCFullYear().toString()
    : "-NOW";
  return startYear ? `${startYear}${endYear}` : endYear;
}

export function ExperienceSection({
  experienceGroups,
  resumeURL,
}: ExperienceSectionProps) {
  return (
    <div className="w-full max-w-[453px]">
      <div className="flex flex-col gap-0.5">
        {experienceGroups.map((group) => (
          <div key={group.company} className="flex gap-2 md:gap-3 items-start">
            {/* Company logo — scaled for mobile */}
            <div className="relative rounded shrink-0 mt-px overflow-hidden w-4 h-4 md:w-[24px] md:h-[24px]">
              {group.logo?.asset && (
                <Image
                  src={urlFor(group.logo).width(100).height(100).url()}
                  alt={group.company}
                  fill
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
                  className="m-0 text-foreground/80 flex min-w-0 items-baseline gap-1"
                >
                  <span className="shrink-0 uppercase">
                    {role.jobTitle ?? ""}
                  </span>
                  <span
                    className="flex-1 min-w-[1ch] overflow-hidden whitespace-nowrap"
                    aria-hidden
                  >
                    {"_".repeat(200)}
                  </span>
                  <span className="shrink-0 tabular-nums">
                    {formatDate(role)}
                  </span>
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
