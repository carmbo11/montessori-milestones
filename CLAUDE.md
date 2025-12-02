# Montessori Milestones - Project Context

## Overview

Montessori Milestones is a marketing/content site for Montessori parenting resources with affiliate product recommendations. It serves as the prototype for a future multi-tenant marketing CMS SaaS.

## Live Site

- **Production URL:** https://www.montessorimilestones.com
- **Hosting:** Vercel (auto-deploys from GitHub)
- **Repository:** https://github.com/carmbo11/montessori-milestones

## Git Workflow

- `master` - Production branch (triggers Vercel deploy)
- `dev` - Staging branch (Vercel preview deployments)
- Always work on `dev`, merge to `master` when ready to ship

## Tech Stack

- **Frontend:** React + TypeScript + Vite
- **Styling:** Tailwind CSS
- **LLM:** Groq (llama-3.1-70b-versatile) - **Always use Groq, ignore Gemini versions**
- **Backend:** Vercel serverless functions (`/api` folder)
- **Data Storage:** Flat files (`constants.tsx`) - no database yet

## LLM Configuration

**IMPORTANT:** This project uses Groq for all LLM functionality. Do not switch to Gemini or other providers.

- API endpoints: `/api/chat.ts`, `/api/quote.ts`
- Model: `llama-3.1-70b-versatile`
- Environment variable: `GROQ_API_KEY` (set in Vercel)

## Data Architecture

Currently all data lives in `constants.tsx`:
- `BLOG_POSTS` - Blog content
- `PRODUCTS` - Affiliate products (Lovevery)
- `MOCK_LEADS` - CRM lead data
- `CAMPAIGN_STATS` - Marketing metrics
- `STAFF_ADVICE` - Educator quotes
- `EDUCATOR_RESOURCES` - Teacher resources

Types defined in `types.ts`.

## Affiliate Marketing

- **Platform:** Impact.com
- **Current Brand:** Lovevery (ages 0-4)
- **Planned Brand:** The Woobles (crochet kits)
- **Integration Level:** Manual links for now (stored in constants)

## Chatbot (Maria)

The chatbot "Maria" (inspired by Maria Montessori) helps parents find appropriate products.

**Current behavior:**
- Asks for child's age
- Recommends products from inventory
- Explains Montessori principles
- Includes affiliate links in responses

**Knowledge sources:**
- Product catalog (hardcoded in `/api/chat.ts`)
- Maria Montessori philosophy context

## Current Sprint (Dec 2024)

**Focus:** Ship MM as polished single site before extracting to multi-tenant CMS

### Completed (Dec 2, 2024)
- [x] **Email Setup** - Cloudflare Email Routing configured
  - revella@montessorimilestones.com → forwards to Yahoo
  - DNS: MX records, SPF, DKIM all configured
  - Gmail "Send mail as" set up for outbound email

### Remaining Tasks
1. **Admin Auth** - Supabase Auth to protect CMS (footer link)
2. **Impact.com API** - Connect affiliate dashboard, auto-sync products
3. **Chatbot Enhancements** - Expand Lovevery catalog (22 Play Kits), improve conversation flow

### Infrastructure Status
- [x] Cloudflare: Domain active, email routing configured
- [ ] Supabase: Create project, add auth
- [ ] Impact.com: Get API credentials, build sync

## Feature Roadmap (MM Instance)

**Strategy:** Complete MM as single instance first, then extract to multi-tenant CMS platform.

### High Priority
1. Add auth to CMS/admin (currently unprotected link in footer)
2. Enhanced chatbot - expand Lovevery catalog (all 22 Play Kits, ages 0-5)
3. Improve chatbot conversation flow (age detection, multi-turn memory)

### Features
4. Events calendar
5. Forum (user-created topics)
6. Pinterest feed integration
7. Blog post fader (one at a time)

### Section Updates
- Volunteer → link to Resources page
- Wisdom from Staff → "View Educator Portal" button

### Auth Options (for CMS)
- Simple: Environment variable password (quick, single user)
- Better: Supabase Auth (will reuse in multi-tenant CMS later)

## Multi-Tenant CMS (Parallel Track)

This codebase will become the first tenant of a new `marketing-cms` SaaS platform.

**Planned architecture:**
- SQLite per tenant (migration path to Postgres + tenant_id)
- Upstash Vector for RAG embeddings (tenant namespaces)
- Full Impact.com API integration
- Cloudflare R2 for image storage
- Supabase Auth

**RAG Chatbot Plan:**
- Tenant-configurable knowledge sources
- Products + blog + external knowledge base
- Vector embeddings via Upstash

## Shared Infrastructure (All Projects)

- **Frontend hosting:** Vercel
- **Image storage:** Cloudflare R2
- **Auth (new projects):** Supabase Auth
- **Vector DB:** Upstash Vector

## File Structure

```
montessori-milestones/
├── api/
│   ├── chat.ts          # Groq chatbot endpoint
│   └── quote.ts         # Daily quote generator
├── components/
│   ├── Button.tsx
│   ├── Carousel.tsx
│   ├── CRMSystem.tsx
│   ├── FeaturedPostCarousel.tsx
│   ├── Hero.tsx
│   ├── Logo.tsx
│   ├── MontessoriBot.tsx
│   └── ProductCard.tsx
├── services/
│   └── groqService.ts   # Frontend API client
├── App.tsx              # Main app component
├── constants.tsx        # All data (blog, products, etc.)
├── types.ts             # TypeScript interfaces
├── index.html
├── index.tsx
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Environment Variables (Vercel)

Required:
- `GROQ_API_KEY` - Groq API key for chatbot

## Development

```bash
npm install
npm run dev
```

## Deployment

Push to `master` branch triggers automatic Vercel deployment.
Push to `dev` branch creates preview deployment.
