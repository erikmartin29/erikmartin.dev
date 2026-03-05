import { ContentBox } from "@/components/ui/content-box";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { sanityFetch } from "@/sanity/live";
import { PROJECT_QUERY } from "@/sanity/queries";
import type { PROJECT_QUERYResult } from "@/sanity/sanity.types";
import { PortableText } from "@portabletext/react";
import { projectPortableTextComponents } from "@/components/portable-text";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: project } = await sanityFetch<PROJECT_QUERYResult>({
    query: PROJECT_QUERY,
    params: { slug },
  });
  if (!project) return { title: "Project Not Found" };
  return {
    title: `${project.title} | Erik Martin`,
    description: project.description ?? undefined,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: project } = await sanityFetch<PROJECT_QUERYResult>({
    query: PROJECT_QUERY,
    params: { slug },
  });

  if (!project) notFound();

  return (
    <>
      <ContentBox innerClassName="py-[75px]" />

      <ContentBox innerClassName="py-5" showBottomLine>
        <Link
          href="/work"
          className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors duration-150 mb-5 uppercase tracking-wider"
        >
          <ArrowLeft size={12} />
          Work
        </Link>

        <h1
          className="font-serif text-3xl md:text-4xl font-bold leading-tight tracking-tight mb-4"
          style={{ fontFamily: "var(--font-pt-serif), Georgia, serif" }}
        >
          {project.title}
        </h1>

        <div className="font-mono text-xs text-muted-foreground/70 uppercase tracking-wide flex flex-wrap items-center gap-x-2 gap-y-1">
          {project.year && <span>{project.year}</span>}
          {project.tags && project.tags.length > 0 && (
            <>
              {project.year && <span aria-hidden>·</span>}
              {project.tags.map((tag, i) => (
                <span key={tag}>
                  {tag}
                  {i < (project.tags?.length ?? 0) - 1 && ", "}
                </span>
              ))}
            </>
          )}
        </div>

        {(project.link || project.github) && (
          <div className="flex items-center gap-4 mt-4">
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-xs text-foreground hover:text-accent transition-colors uppercase tracking-wider"
              >
                Live <ExternalLink size={12} />
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-xs text-foreground hover:text-accent transition-colors uppercase tracking-wider"
              >
                Code <Github size={12} />
              </a>
            )}
          </div>
        )}
      </ContentBox>

      {(project.videoUrl || project.thumbnailUrl) && (
        <ContentBox innerClassName="py-0" showBottomLine>
          {project.videoUrl ? (
            <video
              src={project.videoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto max-h-[500px] object-cover"
            />
          ) : project.thumbnailUrl ? (
            <img
              src={project.thumbnailUrl}
              alt={project.title ?? "Project image"}
              className="w-full object-cover max-h-[500px]"
            />
          ) : null}
        </ContentBox>
      )}

      {project.body && (
        <ContentBox innerClassName="py-8" showBottomLine>
          <div className="prose prose-neutral dark:prose-invert max-w-none font-mono text-sm leading-relaxed prose-headings:font-serif prose-headings:font-bold prose-headings:tracking-tight prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-img:rounded-none prose-pre:rounded-none prose-pre:border prose-pre:border-foreground/10 prose-code:text-accent prose-code:font-mono prose-code:text-xs">
            <PortableText
              value={project.body}
              components={projectPortableTextComponents}
            />
          </div>
        </ContentBox>
      )}
    </>
  );
}
