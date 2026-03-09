---
name: Work Page Masonry Redesign
overview: Replace the current folder-card grid on /work with a 2-column masonry layout (center gutter only, no outer padding). Update the Sanity project schema to support image or looping video thumbnails, and blog-style body content with extensible custom block types. Add project detail pages at /work/[slug].
todos:
  - id: schema
    content: "Update Sanity project schema: add year, thumbnail, thumbnailVideo, body (with custom block types), order; remove image/images"
    status: completed
  - id: masonry-components
    content: Create MasonryGrid (CSS columns, center gutter only) and ProjectMasonryCard (image/video, title+year) components
    status: completed
  - id: work-page
    content: Rewrite /work page to use masonry layout; delete ProjectFolderCard
    status: completed
  - id: detail-page
    content: Create /work/[slug] detail page with blog-style layout and PortableText rendering
    status: completed
  - id: portable-text
    content: Create custom PortableText components for image, code, and customComponent block types
    status: completed
  - id: queries
    content: Update PROJECTS_QUERY, add PROJECT_QUERY, update HOME_QUERY featured projects
    status: completed
  - id: typegen
    content: Regenerate Sanity types
    status: completed
isProject: false
---

# Work Page Masonry Redesign

## Phase 1: Sanity Schema Updates

**File:** [apps/studio/schemaTypes/project.ts](apps/studio/schemaTypes/project.ts)

Replace the current schema fields with:

- `title` (string) -- keep as-is
- `slug` (slug) -- keep as-is
- `description` (text) -- keep (SEO meta + detail page intro)
- `tags` (array of string) -- keep (detail page only)
- `link` (url) -- keep
- `github` (url) -- keep
- `year` (string) -- **new**, displayed right-aligned on masonry card
- `thumbnail` (image, hotspot: true) -- **new**, replaces old `image` + `images` fields
- `thumbnailVideo` (file, accept: `video/mp4,video/webm`) -- **new**, optional looping video that takes priority over `thumbnail` when present
- `body` (array, Portable Text) -- **new**, blog-style writeup with these block types:
  - `block` -- standard text (headings, paragraphs, lists, marks)
  - `image` -- with `caption` (string) and `alt` (string) sub-fields
  - `code` -- with `language` (string), `filename` (string), `code` (text)
  - `customComponent` -- with `componentName` (string) + `props` (text/JSON) for future interactive widgets
- `order` (number) -- **new**, manual sort order

**Remove:** `image`, `images` (replaced by `thumbnail`)

## Phase 2: New Masonry Components

**Create:** `apps/web/src/components/masonry-grid.tsx`

CSS `column-count` based masonry container:

- `column-count: 1` on mobile, `column-count: 2` at `md`
- `column-gap` for the center gutter (~16-20px)
- No outer padding (handled by the parent `ContentBox` padding)
- Children use `break-inside: avoid`

**Create:** `apps/web/src/components/project-masonry-card.tsx`

Each card:

- Wraps in `<Link href={/work/${slug}}>` for internal navigation
- If `thumbnailVideo` exists: render `<video autoPlay loop muted playsInline>` with the video file URL
- Otherwise: render `<Image>` with natural aspect ratio from Sanity asset dimensions
- Below media: flex row with title (left) and year (right, uppercase mono, muted)
- Bottom margin for vertical spacing between masonry items
- Subtle hover transition on the thumbnail

## Phase 3: Update Work Page

**Modify:** [apps/web/src/app/work/page.tsx](apps/web/src/app/work/page.tsx)

- Replace `ProjectFolderCard` grid with `MasonryGrid` + `ProjectMasonryCard`
- "Work" heading in bold serif matching Figma
- Use updated `PROJECTS_QUERY` with new fields

**Delete:** [apps/web/src/components/project-folder-card.tsx](apps/web/src/components/project-folder-card.tsx)

## Phase 4: Project Detail Page

**Create:** `apps/web/src/app/work/[slug]/page.tsx`

Blog-style layout using `ContentBox`:

1. Back link arrow to `/work`
2. Title (serif, large)
3. Meta: year, tags
4. Hero thumbnail (image or video)
5. Body rendered via `<PortableText>` with custom components
6. External links (live site, GitHub) if present

**Create:** `apps/web/src/components/portable-text/index.tsx`

Custom PortableText `components` map:

- **Image blocks** -- responsive `next/image` with optional caption
- **Code blocks** -- syntax-highlighted code (e.g., `shiki` or `prism-react-renderer`) with language label and optional filename
- **Custom component blocks** -- registry pattern: `Record<string, ComponentType>` keyed by `componentName`, renders the matching React component with parsed `props`

## Phase 5: Query Updates

**Modify:** [apps/web/src/sanity/queries.ts](apps/web/src/sanity/queries.ts)

Update `PROJECTS_QUERY` (masonry listing):

```groq
*[_type == "project"] | order(order asc, _createdAt desc) {
  _id, title, year, slug,
  "thumbnailUrl": thumbnail.asset->url,
  "thumbnailDimensions": thumbnail.asset->metadata.dimensions,
  "videoUrl": thumbnailVideo.asset->url
}
```

Add `PROJECT_QUERY` (detail page):

```groq
*[_type == "project" && slug.current == $slug][0] {
  ...,
  "thumbnailUrl": thumbnail.asset->url,
  "videoUrl": thumbnailVideo.asset->url,
  body[]{ ..., _type == "image" => { ..., asset-> } }
}
```

Update the `featuredProjects` section in `HOME_QUERY` to align with the renamed fields if needed.

## Phase 6: Type Generation

Run Sanity typegen to regenerate [apps/web/src/sanity/sanity.types.ts](apps/web/src/sanity/sanity.types.ts) after schema changes.