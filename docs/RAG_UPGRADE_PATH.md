# RAG Stack Upgrade Path

## Current Stack (December 2025)

| Component | Choice | Cost |
|-----------|--------|------|
| Dense Embeddings | Voyage-3 (1024 dims) | ~$0.06/1M tokens |
| Sparse Embeddings | SPLADE via FastEmbed | ~$5/mo (Railway) |
| Vector DB | Upstash Hybrid | Free tier |
| LLM | Groq + Llama-3.1-70B | Free tier |
| Frontend | Vercel | Free tier |
| Database | Supabase | Free tier |

**Total: ~$5-10/month**

Validated by Perplexity as "modern best practice" for production RAG under moderate scale.

---

## Upgrade Triggers & Paths

### 1. Voyage Reranker (Easy Add)

**When to add:**
- Search results feel "close but not quite right"
- Ambiguous queries returning suboptimal order
- Catalog grows beyond 500 products

**Implementation:** 5 minutes, no architecture change

```typescript
// After vector search, before sending to LLM
import Anthropic from 'voyageai'; // or fetch API

const voyage = new Anthropic({ apiKey: VOYAGE_API_KEY });

const reranked = await voyage.rerank({
  query: userQuery,
  documents: searchResults.map(r => r.text),
  model: 'rerank-2',
  top_k: 5
});
```

**Cost:** ~$0.05/1K reranks (negligible)

**Effort:** Add 10 lines of code, no infra changes

---

### 2. Multimodal Search (Product Images)

**When to add:**
- Users want to upload photos and find similar products
- "Show me toys like this one"
- Visual style matching

**Implementation:**

```typescript
// Voyage multimodal embeddings
const embedding = await voyage.multimodalEmbed({
  inputs: [{ image: base64Image }],
  model: 'voyage-multimodal-3'
});
```

**Changes required:**
- Add image upload to chatbot UI
- Store image embeddings alongside text embeddings
- Update Upstash index (same hybrid approach works)

**Cost:** Similar to text embeddings

**Effort:** Medium - UI changes + new embedding pipeline

---

### 3. Frontier Reasoning Model (Complex Queries)

**When to add:**
- Multi-hop reasoning failures ("Compare X vs Y vs Z across 5 criteria")
- Complex chain-of-thought needed
- High-stakes outputs requiring stronger reasoning

**Implementation:** Two-tier model approach

```typescript
// Simple queries → Groq (fast, cheap)
// Complex queries → GPT-4o or Claude (reasoning)

const isComplex = detectComplexity(query); // heuristic or classifier

const response = isComplex
  ? await openai.chat({ model: 'gpt-4o', ... })
  : await groq.chat({ model: 'llama-3.1-70b', ... });
```

**Cost:** GPT-4o adds ~$0.01-0.03 per complex query

**Effort:** Add complexity detector + second LLM client

---

### 4. Safety & Compliance Layer

**When to add:**
- Public-facing chatbot at scale
- Taking real-world actions (send emails, charge cards)
- Regulatory requirements

**Implementation:**

```typescript
// Input validation
const inputSafe = await moderationCheck(userMessage);

// Output validation
const outputSafe = await moderationCheck(llmResponse);

// Action confirmation
if (action.type === 'send_email') {
  await requireUserConfirmation(action);
}
```

**Components to add:**
- Input/output moderation (OpenAI moderation API or custom)
- Action confirmation UI
- Audit logging to Supabase
- Rate limiting per user

**Effort:** Medium-High - requires UI + backend changes

---

### 5. Large Catalog / Merchandising

**When to add:**
- Catalog exceeds 1000+ products
- Need faceted search (filter by price, category, age)
- Merchandising team wants pinning, boosting, A/B tests
- Analytics on search queries

**Implementation:** Add Elasticsearch or OpenSearch

```
Current:  Query → Upstash Hybrid → LLM
Upgraded: Query → Elasticsearch (facets/filters) → Upstash (semantic) → Rerank → LLM
```

**Changes required:**
- Deploy Elasticsearch (managed: Elastic Cloud, AWS OpenSearch)
- Sync products to ES with structured fields
- Use ES for faceted browse, Upstash for semantic search
- Merge results

**Cost:** $30-100/mo for managed Elasticsearch

**Effort:** High - new infrastructure + data sync

---

### 6. Personalization / Recommendations

**When to add:**
- Want "recommended for you" based on user behavior
- Collaborative filtering ("parents who bought X also bought Y")
- Session-based recommendations

**Implementation:** Add recommendation system

Options:
- **Simple:** Store user interactions in Supabase, use vector similarity
- **Medium:** Add Qdrant with user embeddings
- **Advanced:** Dedicated recsys (Recombee, Amazon Personalize)

**Effort:** Medium to High depending on approach

---

### 7. Multi-Tenant Scale

**When to add:**
- 10+ tenants with separate product catalogs
- Need tenant isolation
- Shared infrastructure efficiency

**Implementation:**

```typescript
// Upstash namespaces per tenant
await index.upsert(vectors, { namespace: tenantId });
await index.query(vector, { namespace: tenantId });
```

Or separate indices per tenant for full isolation.

**Changes required:**
- Add tenant_id to all queries
- Namespace or index-per-tenant strategy
- Consider dedicated search infra at scale

**Effort:** Medium - mostly code organization

---

## Priority Order (Recommended)

Based on typical growth patterns:

1. **Voyage Reranker** - Easy win, add when search feels imprecise
2. **Safety Layer** - Add before going viral or taking actions
3. **Multimodal** - Add when users request image search
4. **Multi-Tenant** - Add when building CMS platform
5. **Large Catalog** - Add when hitting 1000+ products
6. **Personalization** - Add when you have enough user data
7. **Frontier Reasoning** - Add for complex B2B or professional use cases

---

## Architecture Evolution

### Phase 1: Current (Now)
```
User → Vercel API → [Voyage + SPLADE] → Upstash Hybrid → Groq → Response
```

### Phase 2: With Reranker
```
User → Vercel API → [Voyage + SPLADE] → Upstash Hybrid → Voyage Rerank → Groq → Response
```

### Phase 3: With Safety
```
User → Moderation → Vercel API → [Voyage + SPLADE] → Upstash → Rerank → Groq → Moderation → Response
```

### Phase 4: Full Scale
```
User → Auth → Moderation → Vercel API
  ├→ Elasticsearch (facets, filters)
  ├→ Upstash Hybrid (semantic)
  └→ Merge + Rerank → [Groq | GPT-4o] → Moderation → Response
```

---

## Quick Reference: Adding Voyage Reranker

When ready, just add this to your chat API:

```typescript
// lib/reranker.ts
export async function rerankResults(
  query: string,
  results: Array<{ id: string; text: string; score: number }>
): Promise<typeof results> {
  const response = await fetch('https://api.voyageai.com/v1/rerank', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.VOYAGE_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query,
      documents: results.map(r => r.text),
      model: 'rerank-2',
      top_k: 5
    })
  });

  const data = await response.json();

  // Reorder results based on rerank scores
  return data.data.map((item: any) => ({
    ...results[item.index],
    score: item.relevance_score
  }));
}
```

Then in your chat API:
```typescript
const searchResults = await searchUpstash(query);
const rerankedResults = await rerankResults(query, searchResults); // Add this line
const context = buildContext(rerankedResults);
```

**That's it.** No infrastructure changes, just better ranking.
