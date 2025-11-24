# [erikmartin.dev](https://erikmartin.dev/)

Monorepo for my personal portfolio/blog!

## About

- `apps/web` - Next.js frontend
- `apps/sanity` - Sanity Studio + schema definitions

### Content Management
* All content is hosted & edited with [Sanity](https://www.sanity.io).

## Deployment
* AWS Amplify deploys and hosts the frontend
* Sanity hosts the studio and manages content

## 🚀 Development
### Prerequisites

- Node v25.1.0 (run `nvm use` to use, or `nvm install` to install)

### Setup

```bash
git clone https://github.com/erikmartin29/erikmartin.dev.git
cd erikmartin.dev
pnpm install
pnpm run dev
```
