import { defineQuery } from "next-sanity";

export const HOME_QUERY = defineQuery(`{
  "home": *[_type == "home"][0] {
    ...,
    "featuredProjects": featuredProjects[]-> {
      _id,
      title,
      tagline,
      year,
      slug,
      "thumbnailUrl": thumbnail.asset->url,
      "videoUrl": thumbnailVideo.asset->url
    }
  },
  "profile": *[_type == "profile"][0] {
    ...,
    "resumeURL": resume.asset->url
  },
  "experience": *[_type == "experience"] | order(startDate desc),
  "skills": *[_type == "skill"] | order(order asc) {
    _id,
    name,
    logoLight,
    logoDark,
    link,
    order
  },
  "recentPosts": *[_type == "post"] | order(publishedAt desc)[0...3] {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    "categories": categories[]->title
  }
}`);

export const ABOUT_QUERY = defineQuery(`{
  "profile": *[_type == "profile"][0] {
    ...,
    "resumeURL": resume.asset->url,
    bio[] {
      ...,
      _type == "image" => { ..., asset-> }
    }
  },
  "experience": *[_type == "experience"] | order(startDate desc)
}`);

export const PROJECTS_QUERY = defineQuery(`*[_type == "project"] | order(order asc, _createdAt desc) {
  _id,
  title,
  tagline,
  year,
  slug,
  "thumbnailUrl": thumbnail.asset->url,
  "thumbnailDimensions": thumbnail.asset->metadata.dimensions,
  "videoUrl": thumbnailVideo.asset->url,
  "projectPost": projectPost-> { slug }
}`);

export const BLOG_QUERY = defineQuery(`*[_type == "post"] | order(publishedAt desc) {
  _id,
  title,
  slug,
  excerpt,
  publishedAt,
  "categories": categories[]->title,
  mainImage
}`);

export const POST_QUERY = defineQuery(`*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  mainImage,
  "categories": categories[]->title,
  publishedAt,
  _updatedAt,
  body[] {
    ...,
    _type == "image" => { ..., asset-> }
  }
}`);

export const FOOTER_QUERY = defineQuery(`*[_type == "profile"][0] {
  socialLinks
}`);

