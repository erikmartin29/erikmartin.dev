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

### Environment Variables

Create a `.env.local` file in the `apps/web` directory with the following:

```bash
# GitHub Personal Access Token for fetching contribution data
# Get one at: https://github.com/settings/tokens
# Required scopes: No scopes needed (public data only)
GITHUB_TOKEN=your_github_personal_access_token_here
```

#### Setting up GitHub Token

1. Go to [GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Give it a descriptive name (e.g., "erikmartin.dev contributions")
4. **No scopes are required** - the GraphQL API can access public contribution data without any scopes
5. Click "Generate token"
6. Copy the token and add it to your `.env.local` file

**Note:** If the token is not set, the contribution graph will not work. 
