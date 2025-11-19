import { defineQuery } from "next-sanity";

export const HOME_QUERY = defineQuery(`{
  "home": *[_type == "home"][0],
  "profile": *[_type == "profile"][0] {
    ...,
    "resumeURL": resume.asset->url
  },
  "experience": *[_type == "experience"] | order(startDate desc),
  "featuredProjects": *[_type == "project"][0...3] {
    _id,
    title,
    description,
    slug,
    tags,
    link,
    github
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

export const PROJECTS_QUERY = defineQuery(`*[_type == "project"] | order(_createdAt desc) {
  _id,
  title,
  description,
  slug,
  tags,
  link,
  github,
  image
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

