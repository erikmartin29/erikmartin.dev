import { ContentBox } from "@/components/ui/content-box";
import { CommitGraph } from "@/components/github-contribution-graph";
import { WorkFolderLink } from "@/components/work-folder-link";
import { ExperienceSection } from "@/components/experience-section";
import { sanityFetch } from "@/sanity/live";
import { HOME_QUERY } from "@/sanity/queries";
import type { HOME_QUERYResult } from "@/sanity/sanity.types";
import { urlFor } from "@/sanity/client";
import Image from "next/image";

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
      <ContentBox className="hidden md:block" innerClassName="py-[75px]" noTransition />

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
            className="select-none text-center text-foreground mt-0.5 leading-none text-[2.5rem] md:text-[3rem]"
            style={{ fontFamily: "var(--font-pt-serif), Georgia, serif" }}
          >
            {parseBold(heading)}
          </h1>
        )}

        {home?.heroSubheading && (
          <p className="select-none font-mono text-[14px] md:text-[17px] text-foreground mt-1.5 text-center">
            {home.heroSubheading}
          </p>
        )}

        {(profile?.socialLinks?.linkedin ||
          profile?.socialLinks?.github ||
          profile?.email) && (
          <p className="font-mono text-[13px] text-foreground mt-2 text-center">
            {[
              profile?.socialLinks?.linkedin && (
                <a
                  key="linkedin"
                  href={profile.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="select-none uppercase no-underline hover:underline"
                >
                  LINKEDIN
                </a>
              ),
              profile?.socialLinks?.github && (
                <a
                  key="github"
                  href={profile.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="select-none uppercase no-underline hover:underline"
                >
                  GITHUB
                </a>
              ),
              profile?.email && (
                <a
                  key="email"
                  href={`mailto:${profile.email}`}
                  className="select-none uppercase no-underline hover:underline"
                >
                  EMAIL
                </a>
              ),
            ]
              .filter(Boolean)
              .reduce<React.ReactNode[]>(
                (acc, el, i) =>
                  acc.length ? [...acc, <span key={`sep-${i}`} className="select-none"> - </span>, el] : [el],
                []
              )}
          </p>
        )}
      </ContentBox>

      <ContentBox innerClassName="py-[19px] md:py-[38px]" />

      <ContentBox innerClassName="py-[15px] flex flex-col items-center">
        <ExperienceSection
          experienceGroups={experienceGroups}
          resumeURL={profile?.resumeURL}
        />
      </ContentBox>

      <ContentBox innerClassName="py-[19px] md:py-[38px]" />

      <ContentBox innerClassName="py-[38px] flex flex-col items-center">
        <WorkFolderLink />
      </ContentBox>

      <ContentBox innerClassName="py-[19px] md:py-[38px]" />

      {profile?.socialLinks?.github && (
        <ContentBox innerClassName="py-[38px] flex flex-col items-center" showBottomLine>
          <div style={{ width: 453 }}>
            <CommitGraph githubUrl={profile.socialLinks.github} />
          </div>
        </ContentBox>
      )}
    </>
  );
}
