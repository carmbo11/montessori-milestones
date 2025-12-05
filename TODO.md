# Montessori Milestones - TODO

## Current Sprint: RAG Chatbot + Affiliate System
**Estimated Total: 15-18 hours**
**Plan:** `docs/plans/2024-12-05-rag-affiliate-system.md`

### Phase 1: Database Setup (2-3h)
- [ ] Create Supabase tables (products, affiliate_links, embeddings, clicks)
- [ ] Seed Lovevery products from constants.tsx
- [ ] Create server-side Supabase client

### Phase 2: Affiliate Link Scoring (2-3h)
- [ ] Port scoring logic from marketing-cms (`calculateEffectiveValue`, `selectBestLink`)
- [ ] Create `/api/products` endpoint with auto-selected best link
- [ ] Add click tracking with `/api/track-click`

### Phase 3: RAG Chatbot (4-5h)
- [ ] Setup Upstash Vector account + index
- [ ] Create embedding pipeline (OpenAI text-embedding-3-small)
- [ ] Embed all products to vector store
- [ ] Create RAG query function
- [ ] Update `/api/chat` to use RAG context

### Phase 4: Admin UI (3-4h)
- [ ] Products tab - list/edit products from Supabase
- [ ] Toggle `show_on_site` per product
- [ ] Affiliate links management per product
- [ ] Show which link is "winning" + manual override
- [ ] Affiliate settings page (strategy, network priority)

### Phase 5: Awin Integration (2-3h) - When Approved
- [ ] Get Awin credentials (Publisher ID, API Key)
- [ ] Add environment variables
- [ ] Implement product feed sync (CSV parsing)

---

## Environment Variables Needed

```env
# Already configured
GROQ_API_KEY=✅
VITE_SUPABASE_URL=✅
VITE_SUPABASE_ANON_KEY=✅
VITE_ADMIN_EMAILS=✅

# Need to add
SUPABASE_SERVICE_ROLE_KEY=⏳
UPSTASH_VECTOR_REST_URL=⏳
UPSTASH_VECTOR_REST_TOKEN=⏳
OPENAI_API_KEY=⏳

# When affiliate networks approved
IMPACT_ACCOUNT_SID=⏳
IMPACT_AUTH_TOKEN=⏳
AWIN_PUBLISHER_ID=⏳
AWIN_API_KEY=⏳
```

---

## Backlog

### High Priority
- [ ] Expand Lovevery catalog (all 22 Play Kits, ages 0-5)
- [ ] Improve chatbot conversation flow (multi-turn memory)

### Features
- [ ] Events calendar
- [ ] Forum (user-created topics)
- [ ] Pinterest feed integration
- [ ] Blog post fader (one at a time)

### Section Updates
- [ ] Volunteer → link to Resources page
- [ ] Wisdom from Staff → "View Educator Portal" button

---

## Completed

### December 5, 2024
- [x] Admin Auth - Supabase magic link auth at /admin route
- [x] Impact.com API integration (mock data until approved)
- [x] Site scroll bug fix (chatbot no longer scrolls on load)
- [x] RAG + Affiliate system plan created

### December 2, 2024
- [x] Email Setup - Cloudflare Email Routing configured
  - revella@montessorimilestones.com → forwards to Yahoo
  - DNS: MX records, SPF, DKIM configured
  - Gmail "Send mail as" set up for outbound

---

## Waiting On

- [ ] Impact.com approval → then add API credentials
- [ ] Awin approval → then implement integration
- [ ] Google AI Studio file merge (user downloading)
