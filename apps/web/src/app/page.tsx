import { ContentBox } from "@/components/ui/content-box";
import { sanityFetch } from "@/sanity/live";
import { HOME_QUERY } from "@/sanity/queries";
import type { HOME_QUERYResult } from "@/sanity/sanity.types";
import { urlFor } from "@/sanity/client";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

export default async function Home() {
  const { data } = await sanityFetch<HOME_QUERYResult>({ query: HOME_QUERY });
  const { home, profile, experience } = data;

  // group consecutive experiences by date and company
  type ExperienceItem = NonNullable<typeof experience>[number];
  const experienceGroups = (experience ?? []).reduce<
    {
      company: string;
      companyUrl: string | null | undefined;
      logo: ExperienceItem["logo"];
      roles: ExperienceItem[];
    }[]
  >((acc, job) => {
    const company = job.company ?? "";
    const existing = acc.find((g) => g.company === company);
    if (existing) {
      existing.roles.push(job);
    } else {
      acc.push({
        company,
        companyUrl: job.companyUrl,
        logo: job.logo,
        roles: [job],
      });
    }
    return acc;
  }, []);

  // parse text between ** as bold
  const parseBold = (text: string) =>
    text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
      i % 2 === 1 ? <strong key={i}>{part}</strong> : part
    );

  const heading = home?.heroHeading ?? "";

  return (
    <>
      <ContentBox innerClassName="py-[75px]" />

      <ContentBox innerClassName="py-[15px] flex flex-col items-center">
        {profile?.profileImage && (
          <div
            className="relative rounded-full overflow-hidden"
            style={{ width: 174, height: 174 }}
          >
            <Image
              src={urlFor(profile.profileImage).width(500).height(500).url()}
              alt={profile.fullName ?? "Profile"}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {heading && (
          <h1
            className="text-center text-foreground mt-0.5 leading-none"
            style={{
              fontFamily: "var(--font-pt-serif), Georgia, serif",
              fontSize: "4rem",
            }}
          >
            {parseBold(heading)}
          </h1>
        )}

        {home?.heroSubheading && (
          <p className="font-mono text-[17px] text-foreground mt-1.5 text-center">
            {home.heroSubheading}
          </p>
        )}
      </ContentBox>

      <ContentBox innerClassName="py-[38px]" />

      <ContentBox innerClassName="py-[15px] flex flex-col items-center" showBottomLine>
        <div style={{ width: 453 }}>
          <div className="flex flex-col gap-0.5">
            {experienceGroups.map((group) => (
              <div key={group.company} className="flex gap-3 items-start">
                {/* Company logo */}
                <div
                  className="relative rounded shrink-0 mt-px overflow-hidden"
                  style={{ width: 26, height: 26 }}
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

                {/* Company name + roles — all 14px mono, same text block */}
                <div className="font-mono leading-snug" style={{ fontSize: 14, width: 415 }}>
                  {group.companyUrl ? (
                    <a
                      href={group.companyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="m-0 inline-flex items-center gap-1 font-bold uppercase text-accent no-underline hover:underline [&>svg]:opacity-0 hover:[&>svg]:opacity-100 [&>svg]:text-accent transition-[text-decoration,opacity]"
                      style={{ fontSize: 14 }}
                    >
                      {group.company}
                      <ExternalLink size={12} strokeWidth={2.25} className="shrink-0" />
                    </a>
                  ) : (
                    <p className="m-0 font-bold uppercase text-accent">
                      {group.company}
                    </p>
                  )}
                  {group.roles.map((role) => {
                    const isSingleDate =
                      role.dateDisplayType === "single" && role.singleDate;
                    const dateStr = isSingleDate
                      ? new Date(role.singleDate!).getUTCFullYear().toString()
                      : (() => {
                          const startYear = role.startDate
                            ? new Date(role.startDate).getUTCFullYear()
                            : null;
                          const endYear = role.endDate
                            ? new Date(role.endDate).getUTCFullYear().toString()
                            : "PRESENT";
                          return startYear ? `${startYear}-${endYear}` : endYear;
                        })();

                    // Monospace dash fill: text area = 415px, Geist Mono 14px ≈ 8.4px/char → 49 chars/line
                    const CHARS_PER_LINE = 49;
                    const title = (role.jobTitle ?? "").toUpperCase();
                    const date = dateStr.toUpperCase();
                    const dashCount = Math.max(1, CHARS_PER_LINE - title.length - date.length - 2);
                    const line = `${title} ${"-".repeat(dashCount)} ${date}`;

                    return (
                      <p
                        key={role._id}
                        className="m-0 text-foreground/80 whitespace-nowrap"
                      >
                        {line}
                      </p>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Download resume */}
          {profile?.resumeURL && (
            <div className="flex justify-center mt-4">
              <a
                href={profile.resumeURL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center rounded-full border border-foreground/10 hover:border-foreground/50 font-mono text-[13px] uppercase text-foreground transition-colors bg-transparent"
                style={{ width: 240, height: 31 }}
              >
                DOWNLOAD RESUME
              </a>
            </div>
          )}
        </div>
      </ContentBox>
    </>
  );
}
