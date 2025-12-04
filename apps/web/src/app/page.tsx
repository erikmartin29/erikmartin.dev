import { GlassButton } from "@/components/ui/glass-button";
import { GlassCard } from "@/components/ui/glass-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { SkillCard } from "@/components/skill-card";
import { CommitGraph } from "@/components/github-contribution-graph";
import { sanityFetch } from "@/sanity/live";
import { HOME_QUERY } from "@/sanity/queries";
import type { HOME_QUERYResult } from "@/sanity/sanity.types";
import { PortableText } from "@portabletext/react";
import { ArrowRight, FileText, Github, Linkedin, Mail, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/client";

export default async function Home() {
  const { data } = await sanityFetch<HOME_QUERYResult>({
    query: HOME_QUERY,
  });
  const { home, profile, experience, skills } = data;

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col items-center text-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        {/* Profile Image */}
        {profile?.profileImage && (
          <div 
            className="relative overflow-hidden rounded-full shadow-lg w-48 h-48 md:w-60 md:h-60"
          >
            <Image
              src={urlFor(profile.profileImage).width(500).height(500).url()}
              alt={profile?.fullName || "Profile Picture"}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
        
        {/* Status */}
        {home?.availabilityStatus && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-sm font-medium text-accent mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            {home.availabilityStatus}
          </div>
        )}
        
        {/* Hero Heading and Subheading */}
        <div>
          <h1 
            className="m-1 px-4 font-bold tracking-tight whitespace-nowrap"
            style={{ fontSize: 'clamp(3.5rem, 5vw, 4.5rem)' }}
          >
            {home?.heroHeading}
          </h1>
          
          <p 
            className="m-1 px-4 py-2 text-muted-foreground max-w-2xl leading-relaxed line-clamp-4 md:line-clamp-none md:whitespace-nowrap"
            style={{ fontSize: 'clamp(0.9rem, 2vw, 1.25rem)' }}
          >
            {home?.heroSubheading}
          </p>
        </div>
        
        {/* Projects and Social Links */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-0">
          <Link href="/projects">
            <GlassButton className="gap-2">
              View Projects <ArrowRight size={18} />
            </GlassButton>
          </Link>
          
          <div className="flex items-center gap-2 px-4">
             {profile?.socialLinks?.github && (
                <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-accent transition-colors p-2" aria-label="GitHub">
                  <Github size={24} strokeWidth={1.5}/>
                </a>
              )}
              {profile?.socialLinks?.linkedin && (
                 <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-accent transition-colors p-2" aria-label="LinkedIn">
                  <Linkedin size={24} strokeWidth={1.5}/>
                </a>
              )}
              {profile?.email && (
                <a href={`mailto:${profile.email}`} className="text-muted-foreground hover:text-accent transition-colors p-2" aria-label="Email">
                  <Mail size={24} strokeWidth={1.5} />
                </a>
              )}
          </div>
        </div>
      </section>
      
      {/* Bio */}
      {profile?.bio && (
        <section className="py-10">
          <GlassCard className="p-6 md:p-8 prose prose-neutral dark:prose-invert max-w-none w-full">
                <PortableText value={profile.bio} /> 
          </GlassCard>
        </section>
      )}

      {/* Experience */}
      <section className="space-y-8 pt-5 mx-2">
        <div className="flex items-center justify-between">
           <SectionHeading title="Experience" align="left" className="mb-0" />
           {profile?.resumeURL && (
              <a href={profile.resumeURL} target="_blank" rel="noopener noreferrer">
                <GlassButton size="sm" className="gap-2" variant="ghost">
                  <FileText size={16} /> <span className="hidden md:inline">Download Resume</span>
                </GlassButton>
              </a>
            )}
        </div>
        
        <div className="flex flex-col gap-6">
          { experience?.length > 0 && 
            experience.map((job) => {
              const startDate = job.startDate
                ? new Date(job.startDate).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                    timeZone: "UTC",
                  })
                : undefined;
              const endDate = job.endDate
                ? new Date(job.endDate).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                    timeZone: "UTC",
                  })
                : "Present";

              return (
                <GlassCard key={job._id}>
                  <div className="flex flex-col gap-3 mb-1">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-xl font-bold">{job.jobTitle}</h3>
                        <p className="text-accent">{job.company}</p>
                      </div>
                      <div className="flex flex-col items-start sm:items-end">
                        <span className="text-sm text-muted-foreground ">
                          {startDate ?? "Unknown"} - {endDate}
                        </span>
                        {job.location && (
                          <span className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin size={12} />
                            {job.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-muted-foreground">
                    {job.description && <PortableText value={job.description} />}
                  </div>
                </GlassCard>
              );
            }
          )}
        </div>
      </section>

      {/* Skills */}
      {skills?.length > 0 && (
        <section className="space-y-6 mx-2">
          <SectionHeading title="Skills" align="left" className="mb-5" />
          
          <div className="flex flex-wrap gap-3">
            { skills.map((skill) => (
                <SkillCard key={skill._id} skill={skill} />
            ))}
          </div>
        </section>
      )}

      {/* GitHub Activity */}
      {profile?.socialLinks?.github && (
        <section className="space-y-6 mx-2">
          <SectionHeading title="GitHub Activity" align="left" className="mb-5" />
          <CommitGraph githubUrl={profile.socialLinks.github} />
        </section>
      )}
    </div>
  );
}
