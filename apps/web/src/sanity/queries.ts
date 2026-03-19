import { defineQuery } from "next-sanity";

export const HOME_QUERY = defineQuery(`{
  "home": *[_type == "home"][0] {
    heroHeading,
    heroSubheading
  },
  "profile": *[_type == "profile"][0] {
    fullName,
    profileImage,
    email,
    socialLinks {
      github,
      linkedin
    },
    "resumeURL": resume.asset->url
  },
  "experience": *[_type == "experience"] | order(coalesce(startDate, singleDate) desc) {
    _id,
    jobTitle,
    company,
    companyUrl,
    logo,
    dateDisplayType,
    startDate,
    endDate,
    singleDate
  }
}`);

export const ABOUT_QUERY = defineQuery(`{
  "profile": *[_type == "profile"][0] {
    bio[] {
      ...,
      _type == "image" => { ..., asset-> }
    }
  }
}`);

export const PROJECTS_QUERY = defineQuery(`*[_type == "project"] | order(order asc, _createdAt desc) {
  _id,
  title,
  tagline,
  github,
  link,
  "thumbnailUrl": thumbnail.asset->url,
  "videoUrl": thumbnailVideo.asset->url,
  "projectPost": projectPost-> { slug }
}`);

export const BLOG_QUERY = defineQuery(`*[_type == "post"] | order(publishedAt desc) {
  _id,
  title,
  slug,
  excerpt,
  publishedAt,
  "categories": categories[]->title
}`);

export const POST_QUERY = defineQuery(`*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  "categories": categories[]->title,
  publishedAt,
  _updatedAt,
  body[] {
    ...,
    _type == "image" => { ..., asset-> },
    _type == "video" => { ..., "videoUrl": asset.asset->url }
  }
}`);
