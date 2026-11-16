This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Caching and on-demand revalidation

Pages (`/`, `/work`, `/about`, `/blog`, `/blog/[slug]`) are statically generated. Sanity reads go through the Sanity API CDN and the Next.js data cache (`sanityFetch` in `src/sanity/live.ts`), tagged by document type and revalidated after 1 hour as a fallback. A Sanity webhook refreshes content right after a publish.

### Sanity webhook setup (manual)

1. Choose a random secret and set it as `SANITY_REVALIDATE_SECRET` in the hosting environment (Amplify environment variables), then redeploy.2. In Sanity (manage.sanity.io, project `5l61z3ol`, API, Webhooks) create a webhook:
   - URL: `https://<your-domain>/api/revalidate`
   - Dataset: `production`
   - Trigger on: Create, Update, Delete
   - Filter: `_type in ["home", "profile", "experience", "project", "post", "category"]`
   - Projection: `{_type, "slug": slug.current}`
   - HTTP method: POST
   - Secret: the same value as `SANITY_REVALIDATE_SECRET`
   - Drafts: off
3. The route (`src/app/api/revalidate/route.ts`) returns 401 if the secret is missing or the signature is invalid, and calls `revalidateTag(tag, { expire: 0 })` for the tags mapped to the document `_type`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
