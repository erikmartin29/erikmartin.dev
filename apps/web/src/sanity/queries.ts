import { defineQuery } from "next-sanity";

export const HOME_QUERY = defineQuery(`{
  "home": *[_type == "home"][0],
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
  "featuredProjects": *[_type == "project"] | order(order asc, _createdAt desc) [0...3] {
    _id,
    title,
    year,
    slug,
    description,
    tags,
    link,
    github,
    "thumbnailUrl": thumbnail.asset->url,
    "videoUrl": thumbnailVideo.asset->url
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
    "resumeURL": resume.asset->url
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
  "videoUrl": thumbnailVideo.asset->url
}`);

export const PROJECT_QUERY = defineQuery(`*[_type == "project" && slug.current == $slug][0] {
  _id,
  title,
  tagline,
  year,
  slug,
  description,
  tags,
  link,
  github,
  "thumbnailUrl": thumbnail.asset->url,
  "videoUrl": thumbnailVideo.asset->url,
  body[] {
    ...,
    _type == "image" => { ..., asset-> }
  }
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
  body
}`);

export const FOOTER_QUERY = defineQuery(`*[_type == "profile"][0] {
  socialLinks
}`);

