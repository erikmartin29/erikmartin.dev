import { SectionHeading } from "@/components/ui/section-heading";
import { ProjectFolderCard } from "@/components/project-folder-card";
import { sanityFetch } from "@/sanity/live";
import { PROJECTS_QUERY } from "@/sanity/queries";
import type { PROJECTS_QUERYResult } from "@/sanity/sanity.types";
import { urlFor } from "@/sanity/client";

export const metadata = {
  title: "Projects | Erik Martin",
  description: "A collection of my recent work and side projects.",
};

export default async function ProjectsPage() {
  const { data: projects } = await sanityFetch<PROJECTS_QUERYResult>({
    query: PROJECTS_QUERY,
  });

  return (
    <div>
      
      <SectionHeading title="Projects" align="center" className="mb-5"/>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
        {projects.map((project) => (
          <ProjectFolderCard
            key={project._id}
            title={project.title ?? "Untitled Project"}
            description={project.description ?? ""}
            tags={project.tags ?? []}
            link={project.link || undefined}
            github={project.github || undefined}
            imageUrls={
              ((project as any).images && (project as any).images.length > 0)
                ? (project as any).images.map((img: any) => urlFor(img).width(600).height(400).url())
                : project.image 
                  ? [urlFor(project.image).width(600).height(400).url()] 
                  : []
            }
          />
        ))}
      </div>
    </div>
  );
}
