import { SectionHeading } from "@/components/ui/section-heading";
import { GlassCard } from "@/components/ui/glass-card";
import { Linkedin, Mail } from "lucide-react";
import { sanityFetch } from "@/sanity/live";
import { HOME_QUERY } from "@/sanity/queries";
import type { HOME_QUERYResult } from "@/sanity/sanity.types";

export const metadata = {
  title: "Contact | Erik Martin",
  description: "Get in touch with me for projects or collaborations.",
};

export default async function ContactPage() {
  const { data } = await sanityFetch<HOME_QUERYResult>({
    query: HOME_QUERY,
    // Contact page only needs `profile`, but it shares the same query as home.
    tags: ["home", "profile", "experience", "project", "post"],
  });
  const { profile } = data;

  return (
    <div className="space-y-12">
      <SectionHeading 
        title="Get in Touch" 
        subtitle="Have a project in mind? Let's build something amazing together."
      />

      <div className="max-w-2xl mx-auto">
        <GlassCard className="p-8 space-y-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
              <Mail size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold mb-1">Email Me</h3>
              {profile?.email ? (
                <a href={`mailto:${profile.email}`} className="text-accent hover:underline">
                  {profile.email}
                </a>
              ) : (
                <a href="mailto:hello@erikmartin.dev" className="text-accent hover:underline">
                  hello@erikmartin.dev
                </a>
              )}
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
              <Linkedin size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold mb-1">LinkedIn</h3>
              <p className="text-muted-foreground text-sm mb-2">
                Message me on LinkedIn and/or connect.
              </p>
              {profile?.socialLinks?.linkedin ? (
                 <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                   Connect on LinkedIn
                 </a>
              ) : (
                 <span className="text-muted-foreground">LinkedIn link unavailable</span>
              )}
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
