# Montessori Milestones

A Montessori-focused parenting website with an AI-powered chatbot assistant ("Ask Maria") that helps parents choose age-appropriate educational materials.

## Tech Stack

- **Frontend:** React 19 + TypeScript + Vite
- **AI:** Groq API (Llama 3.1 70B)
- **Hosting:** Vercel
- **Domain:** montessorimilestones.com

## Features

- AI chatbot ("Ask Maria") - virtual Maria Montessori guide for product recommendations
- Product catalog with Lovevery affiliate links
- Blog/content carousel
- CRM system for leads management
- Daily AI-generated Montessori quotes

## Local Development

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables in `.env.local`:
   ```
   GROQ_API_KEY=your_groq_api_key_here
   ```

3. Run the dev server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:3000

## Deployment

Hosted on Vercel with automatic deployments from GitHub.

- **Production URL:** https://montessorimilestones.com
- **Vercel URL:** https://montessori-milestones.vercel.app

## Environment Variables

| Variable | Description |
|----------|-------------|
| `GROQ_API_KEY` | Groq API key for AI chatbot |

Set in Vercel dashboard under Project Settings > Environment Variables.

---

## Session Notes (2025-11-28)

### Completed
- Migrated AI from Google Gemini to Groq (Llama 3.1 70B) for free tier usage
- Created `services/groqService.ts` replacing `geminiService.ts`
- Deployed to Vercel
- Added GROQ_API_KEY to Vercel environment variables
- Created GitHub repo: https://github.com/carmbo11/montessori-milestones
- Configured custom domain (montessorimilestones.com) with Vercel nameservers

### Pending
- DNS propagation for custom domain (nameservers changed to ns1/ns2.vercel-dns.com)
- Disable Vercel Authentication if site requires login to view
- Consider upgrading to newer Groq models (llama-3.3-70b-versatile)
- Add conversation history to chatbot for better context
- Consider RAG implementation for scalable product recommendations

### Known Issues
- No conversation memory in chatbot - each message is independent

### Completed (API Security)
- Moved Groq API calls to Vercel serverless functions (`/api/chat`, `/api/quote`)
- API key no longer exposed in client-side bundle
