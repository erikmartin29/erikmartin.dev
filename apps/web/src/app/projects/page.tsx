import { SectionHeading } from "@/components/ui/section-heading";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import Link from "next/link";
import { ExternalLink, Github } from "lucide-react";
import { sanityFetch } from "@/sanity/live";
import { PROJECTS_QUERY } from "@/sanity/queries";
import type { PROJECTS_QUERYResult } from "@/sanity/sanity.types";
import { urlFor } from "@/sanity/client";
import Image from "next/image";

export const metadata = {
  title: "Projects | Erik Martin",
  description: "A collection of my recent work and side projects.",
};

export default async function ProjectsPage() {
  const { data: projects } = await sanityFetch<PROJECTS_QUERYResult>({
    query: PROJECTS_QUERY,
  });

  return (
    <div className="space-y-12">
      <SectionHeading 
        title="Projects" 
        subtitle="A showcase of my technical skills and creative solutions."
      />

      <div className="grid md:grid-cols-2 gap-8">
        {projects.map((project) => (
          <GlassCard key={project._id} className="flex flex-col h-full" variant="hover">
            <div className="h-48 w-full bg-accent/5 rounded-xl mb-6 border border-white/10 flex items-center justify-center text-muted-foreground overflow-hidden relative group">
              {project.image ? (
                 <Image 
                   src={urlFor(project.image).width(800).height(400).url()} 
                   alt={project.title ?? "Project image"} 
                   fill
                   className="absolute inset-0 w-full h-full object-cover"
                 />
              ) : (
                <span className="text-sm">Project Screenshot</span>
              )}
            </div>
            
            <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
            <p className="text-muted-foreground mb-6 grow">
              {project.description}
            </p>
            
            {project.tags && (
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map((tag: string) => (
                  <span key={tag} className="text-xs font-medium px-2.5 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            <div className="flex items-center gap-4 mt-auto">
              {project.link && (
                <Link href={project.link} className="flex-1" target="_blank">
                  <GlassButton className="w-full gap-2" size="sm">
                    Live Demo <ExternalLink size={16} />
                  </GlassButton>
                </Link>
              )}
              {project.github && (
                <Link href={project.github} className="flex-1" target="_blank">
                  <GlassButton variant="primary" className="w-full gap-2" size="sm">
                    Github <Github size={16} />
                  </GlassButton>
                </Link>
              )}
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
