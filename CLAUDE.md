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

### Completed (Dec 5, 2024)
- [x] **React Router** - Proper URL-based routing (SPA navigation)
- [x] **Page Components** - Extracted from monolithic App.tsx (~800 → ~115 lines)
- [x] **Layout Component** - Shared header/footer wrapper
- [x] **Blog Archive** - `/blog` page with category filter pills
- [x] **Privacy Policy** - `/privacy` with AI chatbot data handling, GDPR/CCPA
- [x] **Terms of Service** - `/terms` with FTC affiliate disclosure (Pennsylvania jurisdiction)
- [x] **Further Exploration** - Horizontal scroll carousel on blog posts
- [x] **Admin Auth** - Supabase magic link authentication for CMS

### Remaining Tasks
1. **Impact.com API** - Connect affiliate dashboard, auto-sync products
2. **Chatbot Enhancements** - Expand Lovevery catalog (22 Play Kits), improve conversation flow

### Infrastructure Status
- [x] Cloudflare: Domain active, email routing configured
- [x] Supabase: Auth configured (magic link for admin)
- [ ] Impact.com: Get API credentials, build sync

## Feature Roadmap (MM Instance)

**Strategy:** Complete MM as single instance first, then extract to multi-tenant CMS platform.

### High Priority
1. ~~Add auth to CMS/admin~~ ✅ Done (Supabase magic link)
2. Enhanced chatbot - expand Lovevery catalog (all 22 Play Kits, ages 0-5)
3. Improve chatbot conversation flow (age detection, multi-turn memory)

### Features
4. Events calendar
5. Forum (user-created topics)
6. Pinterest feed integration
7. Blog post fader (one at a time)

### Section Updates
- Volunteer → link to Resources page
- ~~Wisdom from Staff → "View Educator Portal" button~~ ✅ Done (title shortened to "Wisdom", links to /educators)

### Auth (Implemented)
- Supabase Auth with magic link (email-based login)
- Allowlist: `revella@montessorimilestones.com`
- Admin check via `allowed_admins` table in Supabase

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
│   ├── Layout.tsx       # Shared header/footer wrapper
│   ├── Logo.tsx
│   ├── MontessoriBot.tsx
│   └── ProductCard.tsx
├── hooks/
│   └── useAuth.ts       # Supabase auth hook
├── pages/
│   ├── AdminPage.tsx    # CMS admin (auth-protected)
│   ├── BlogPage.tsx     # Blog archive with filters
│   ├── BlogPostPage.tsx # Individual blog post
│   ├── CategoryPage.tsx # Philosophy/Environment views
│   ├── CommunityPage.tsx
│   ├── EducatorsPage.tsx
│   ├── HomePage.tsx     # Landing page
│   ├── PrivacyPage.tsx  # Privacy policy
│   ├── ShopPage.tsx     # Product catalog
│   └── TermsPage.tsx    # Terms of service
├── services/
│   ├── groqService.ts   # Frontend API client
│   └── supabase.ts      # Supabase client
├── App.tsx              # Routes only (~115 lines)
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
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key

## Development

```bash
npm install
npm run dev
```

## Deployment

Push to `master` branch triggers automatic Vercel deployment.
Push to `dev` branch creates preview deployment.
