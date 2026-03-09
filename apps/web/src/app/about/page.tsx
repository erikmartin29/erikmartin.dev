import { ContentBox } from "@/components/ui/content-box";
import { sanityFetch } from "@/sanity/live";
import { ABOUT_QUERY } from "@/sanity/queries";
import type { ABOUT_QUERYResult } from "@/sanity/sanity.types";
import { PortableText } from "@portabletext/react";
import { projectPortableTextComponents } from "@/components/portable-text";

export const metadata = {
  title: "About | Erik Martin",
  description: "Learn more about Erik Martin.",
};

export default async function AboutPage() {
  const { data } = await sanityFetch<ABOUT_QUERYResult>({ query: ABOUT_QUERY });
  const { profile } = data;

  return (
    <>
      <ContentBox innerClassName="py-[75px]" noTransition />

      <ContentBox innerClassName="py-6 px-[15px]" >
        <h1
          className="font-serif text-4xl font-bold"
          style={{ fontFamily: "var(--font-pt-serif), Georgia, serif" }}
        >
          About
        </h1>
      </ContentBox>

      <ContentBox innerClassName="py-4" showBottomLine>

      {profile?.bio ? (
          <div className="font-mono text-sm text-muted-foreground leading-relaxed w-full prose prose-neutral dark:prose-invert prose-a:text-accent prose-img:rounded-none">
            <PortableText
              value={profile.bio}
              components={projectPortableTextComponents}
            />
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
