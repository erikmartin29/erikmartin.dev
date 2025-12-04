import { SectionHeading } from "@/components/ui/section-heading";
import { GlassCard } from "@/components/ui/glass-card";
import { ContactButton } from "@/components/contact-button";
import { Github, Linkedin, Mail, MapPin, MessageSquare, FileText, Twitter } from "lucide-react";
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
  });
  const { profile } = data;

  const email = profile?.email || "hello@erikmartin.dev";

  return (
    <div className="space-y-12">
      <SectionHeading 
        title="Let's Connect"
      />

      {/* Primary Contact Methods */}
      <section className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Email Card */}
          <GlassCard className="p-6 hover:bg-white/10 transition-all duration-300">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 flex items-center justify-center text-accent">
                <Mail size={28} />
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-lg">Email</h4>
                <a 
                  href={`mailto:${email}`} 
                  className="text-accent hover:underline font-medium break-all"
                >
                  {email}
                </a>
              </div>
              <ContactButton 
                href={`mailto:${email}`}
                size="sm" 
                variant="primary"
                className="w-full"
              >
                Send Email
              </ContactButton>
            </div>
          </GlassCard>

          {/* LinkedIn Card */}
          {profile?.socialLinks?.linkedin && (
            <GlassCard className="p-6 hover:bg-white/10 transition-all duration-300">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 flex items-center justify-center text-accent">
                  <Linkedin size={28} />
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-lg">LinkedIn</h4>
                  <p className="text-sm text-muted-foreground/80">Connect with me and shoot me a message!</p>
                </div>
                <ContactButton 
                  href={profile.socialLinks.linkedin}
                  size="sm" 
                  variant="primary"
                  className="w-full"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Profile
                </ContactButton>
              </div>
            </GlassCard>
          )}
        </div>
      </section>

    </div>
  );
}
