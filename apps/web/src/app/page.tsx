import { GlassButton } from "@/components/ui/glass-button";
import { GlassCard } from "@/components/ui/glass-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { sanityFetch } from "@/sanity/live";
import { HOME_QUERY } from "@/sanity/queries";
import { PortableText } from "@portabletext/react";
import { ArrowRight, FileText, Github, Linkedin, Mail, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/client";

export default async function Home() {
  const { data } = await sanityFetch({ query: HOME_QUERY });
  const { home, profile, experience } = data || {};
  
  console.log("Profile Data:", JSON.stringify(profile, null, 2));

  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col items-center text-center gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="relative w-32 h-32 mb-2 overflow-hidden rounded-full shadow-lg shadow-accent/5 flex items-center justify-center">
          {profile?.profileImage ? (
            <Image
              src={urlFor(profile.profileImage).width(256).height(256).url()}
              alt={profile.fullName || "Profile Picture"}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <User className="w-16 h-16 text-muted-foreground" />
          )}
        </div>
        {home?.availabilityStatus && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-sm font-medium text-accent mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            {home.availabilityStatus}
          </div>
        )}
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
          {home?.heroHeading}
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
          {home?.heroSubheading}
        </p>
        
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/projects">
              <GlassButton className="gap-2">
                View Projects <ArrowRight size={18} />
              </GlassButton>
            </Link>
            
            <div className="flex items-center gap-2 px-4">
               {profile?.socialLinks?.github && (
                  <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-accent transition-colors p-2" aria-label="GitHub">
                    <Github size={24} />
                  </a>
                )}
                {profile?.socialLinks?.linkedin && (
                   <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-accent transition-colors p-2" aria-label="LinkedIn">
                    <Linkedin size={24} />
                  </a>
                )}
                {profile?.email && (
                  <a href={`mailto:${profile.email}`} className="text-muted-foreground hover:text-accent transition-colors p-2" aria-label="Email">
                    <Mail size={24} />
                  </a>
                )}
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-10">
        <GlassCard className="p-8 prose prose-neutral dark:prose-invert max-w-none w-full">
          { profile?.bio && <PortableText value={profile.bio} /> }
        </GlassCard>
      </section>

      {/* Experience Section */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
           <SectionHeading title="Experience" align="left" className="mb-0" />
           {profile?.resumeURL && (
              <a href={profile.resumeURL} target="_blank" rel="noopener noreferrer">
                <GlassButton size="sm" className="gap-2" variant="ghost">
                  <FileText size={16} /> Download PDF
                </GlassButton>
              </a>
            )}
        </div>
        
        <div className="grid gap-6">
          {experience && experience.length > 0 ? (
            experience.map((job: any) => (
              <GlassCard key={job._id} className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{job.role}</h3>
                    <p className="text-accent">{job.company}</p>
                  </div>
                  <span className="text-sm text-muted-foreground bg-white/5 px-3 py-1 rounded-full mt-2 md:mt-0 w-fit">
                    {new Date(job.startDate).getFullYear()} - {job.endDate ? new Date(job.endDate).getFullYear() : 'Present'}
                  </span>
                </div>
                <div className="text-muted-foreground">
                  <PortableText value={job.description} />
                </div>
              </GlassCard>
            ))
          ) : (
             // Fallback experience content so the page isn't empty before CMS data is added
             <>
                <GlassCard className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold">Senior Frontend Engineer</h3>
                      <p className="text-accent">Tech Company Inc.</p>
                    </div>
                    <span className="text-sm text-muted-foreground bg-white/5 px-3 py-1 rounded-full mt-2 md:mt-0 w-fit">
                      2021 - Present
                    </span>
                  </div>
                  <p className="text-muted-foreground">
                    Leading the frontend architecture for the core product. Implemented a new design system 
                    using Tailwind CSS and React, improving development velocity by 40%.
                  </p>
                </GlassCard>
             </>
          )}
        </div>
      </section>
    </div>
  );
}
