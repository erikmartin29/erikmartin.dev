import { ProjectGrid } from "@/components/masonry-grid";
import { ProjectCard } from "@/components/project-masonry-card";
import { ContentBox } from "@/components/ui/content-box";
import { sanityFetch } from "@/sanity/live";
import { PROJECTS_QUERY } from "@/sanity/queries";
import type { PROJECTS_QUERYResult } from "@/sanity/sanity.types";

export const metadata = {
  title: "Work | Erik Martin",
  description: "A collection of my recent work and side projects.",
};

export default async function WorkPage() {
  const { data: projects } = await sanityFetch<PROJECTS_QUERYResult>({
    query: PROJECTS_QUERY,
  });

  return (
    <>
      <ContentBox className="hidden md:block" innerClassName="py-[75px]" noTransition />

      <ContentBox innerClassName="py-6 px-[15px]">
        <h1
          className="text-3xl md:text-4xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-pt-serif), Georgia, serif" }}
        >
          Work
        </h1>
      </ContentBox>

      <ContentBox innerClassName="px-0 py-0 pb-6">
        <ProjectGrid>
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              title={project.title ?? "Untitled"}
              tagline={project.tagline ?? undefined}
              year={project.year ?? undefined}
              blogSlug={project.projectPost?.slug?.current ?? undefined}
              thumbnailUrl={project.thumbnailUrl ?? undefined}
              videoUrl={project.videoUrl ?? undefined}
            />
          ))}
        </ProjectGrid>
      </ContentBox>
    </>
  );
}
