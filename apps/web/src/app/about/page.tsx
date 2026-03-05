import { ContentBox } from "@/components/ui/content-box";
import { sanityFetch } from "@/sanity/live";
import { ABOUT_QUERY } from "@/sanity/queries";
import type { ABOUT_QUERYResult } from "@/sanity/sanity.types";
import { PortableText } from "@portabletext/react";

export const metadata = {
  title: "About | Erik Martin",
  description: "Learn more about Erik Martin.",
};

export default async function AboutPage() {
  const { data } = await sanityFetch<ABOUT_QUERYResult>({ query: ABOUT_QUERY });
  const { profile } = data;

  return (
    <>
      <ContentBox innerClassName="py-[75px]" />

      <ContentBox innerClassName="py-4" showBottomLine>
        <h1
          className="font-serif text-4xl font-bold mb-4"
          style={{ fontFamily: "var(--font-pt-serif), Georgia, serif" }}
        >
          About
        </h1>

        {profile?.bio ? (
          <div className="font-mono text-sm text-muted-foreground leading-relaxed max-w-prose prose prose-neutral dark:prose-invert prose-p:font-mono prose-p:text-sm prose-a:text-accent">
            <PortableText value={profile.bio} />
          </div>
        ) : (
          <p className="font-mono text-sm text-muted-foreground leading-relaxed">
            I&apos;m Erik. I&apos;m a software engineer and product designer based in the Bay Area, CA.
          </p>
        )}
      </ContentBox>
    </>
  );
}
