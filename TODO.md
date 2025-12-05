# Montessori Milestones - TODO

## Bugs
- [x] Site scrolls down to chatbot on page load - FIXED

## In Progress
- [x] Impact.com API - Integration built, waiting for approval
  - API endpoint: `/api/impact-products`
  - Service: `services/impactService.ts`
  - Types: `types/impact.ts`
  - **Env vars needed (add to Vercel when approved):**
    - `IMPACT_ACCOUNT_SID` - Your Impact.com Account SID
    - `IMPACT_AUTH_TOKEN` - Your Impact.com Auth Token
    - `IMPACT_CATALOG_ID` - (Optional) Specific catalog ID for Lovevery

## High Priority
- [ ] Enhanced chatbot - expand Lovevery catalog (all 22 Play Kits, ages 0-5)
- [ ] Improve chatbot conversation flow (age detection, multi-turn memory)

## Features
- [ ] Events calendar
- [ ] Forum (user-created topics)
- [ ] Pinterest feed integration
- [ ] Blog post fader (one at a time)

## Section Updates
- [ ] Volunteer → link to Resources page
- [ ] Wisdom from Staff → "View Educator Portal" button

## Completed
- [x] Admin Auth - Supabase magic link auth at /admin route (Dec 5, 2024)
- [x] Email Setup - Cloudflare Email Routing configured (Dec 2, 2024)
  - revella@montessorimilestones.com → forwards to Yahoo
  - DNS: MX records, SPF, DKIM configured
  - Gmail "Send mail as" set up for outbound
