# RAG Chatbot + Affiliate System Implementation Plan

**Date:** December 5, 2024
**Goal:** Add database-backed products with multi-network affiliate scoring and RAG-powered chatbot

---

## Overview

Transform MM from hardcoded products to a database-driven system with:
1. **Supabase database** for products and affiliate links
2. **Affiliate link scoring** (auto-select best link based on commission, cookie length, conversion)
3. **RAG chatbot** using Upstash Vector for intelligent product recommendations
4. **Admin UI** to manage products and affiliate links

---

## Phase 1: Database Setup (Supabase)
**Estimated: 2-3 hours**

### 1.1 Create Tables

```sql
-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  image_url TEXT,
  age_range TEXT,
  category TEXT,
  tags TEXT[],
  is_active BOOLEAN DEFAULT true,
  show_on_site BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Affiliate links (multiple per product)
CREATE TABLE affiliate_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  network TEXT NOT NULL, -- 'impact', 'awin', 'amazon', etc.
  url TEXT NOT NULL,
  commission_rate DECIMAL(5,4), -- 0.1000 = 10%
  cookie_days INTEGER,
  estimated_conversion DECIMAL(5,4) DEFAULT 0.03,
  is_active BOOLEAN DEFAULT true,
  last_verified TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product embeddings for RAG
CREATE TABLE product_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  embedding VECTOR(1536), -- OpenAI embedding dimension
  content_hash TEXT, -- To detect when re-embedding needed
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Affiliate settings (site-level config)
CREATE TABLE affiliate_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  strategy TEXT DEFAULT 'highest_effective_value',
  network_priority TEXT[] DEFAULT ARRAY['impact', 'awin', 'amazon'],
  track_clicks BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Click tracking
CREATE TABLE affiliate_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id),
  link_id UUID REFERENCES affiliate_links(id),
  network TEXT,
  clicked_at TIMESTAMPTZ DEFAULT NOW(),
  user_agent TEXT,
  referrer TEXT
);
```

### 1.2 Seed Initial Data

Migrate current products from `constants.tsx` to Supabase:
- 6 current Lovevery products
- Add Impact.com affiliate links
- Add placeholder Awin links (when approved)

### 1.3 Create Supabase Client

```typescript
// lib/supabase-db.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

export const supabaseAdmin = createClient<Database>(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Server-side only
);
```

---

## Phase 2: Affiliate Link Scoring
**Estimated: 2-3 hours**

### 2.1 Port Scoring Logic from marketing-cms

```typescript
// lib/affiliate/scoring.ts

export function calculateEffectiveValue(
  commissionRate: number,
  cookieDays: number,
  conversionRate: number = 0.03
): number {
  const cookieFactor = Math.log(cookieDays + 1) / Math.log(31);
  return commissionRate * cookieFactor * conversionRate;
}

export function selectBestLink(
  links: AffiliateLink[],
  strategy: 'highest_commission' | 'highest_effective_value' | 'prefer_direct' | 'manual',
  networkPriority: string[] = ['impact', 'awin', 'amazon'],
  preferredLinkId?: string
): AffiliateLink | null {
  // Implementation from marketing-cms/lib/affiliate/index.ts
}
```

### 2.2 Create API Endpoint

```typescript
// api/products.ts
// Returns products with best affiliate link pre-selected
export default async function handler(req, res) {
  const products = await getProducts();
  const settings = await getAffiliateSettings();

  const productsWithLinks = products.map(p => ({
    ...p,
    affiliateLink: selectBestLink(p.affiliateLinks, settings.strategy)
  }));

  return res.json(productsWithLinks);
}
```

### 2.3 Click Tracking

```typescript
// api/track-click.ts
export default async function handler(req, res) {
  const { productId, linkId } = req.body;

  await supabase.from('affiliate_clicks').insert({
    product_id: productId,
    link_id: linkId,
    user_agent: req.headers['user-agent'],
    referrer: req.headers['referer']
  });

  // Redirect to actual affiliate URL
  const link = await getLink(linkId);
  return res.redirect(302, link.url);
}
```

---

## Phase 3: RAG Chatbot with Upstash Vector
**Estimated: 4-5 hours**

### 3.1 Setup Upstash Vector

1. Create Upstash account (free tier: 10K vectors)
2. Create vector index with dimension 1536 (OpenAI embeddings)
3. Add environment variables:
   - `UPSTASH_VECTOR_REST_URL`
   - `UPSTASH_VECTOR_REST_TOKEN`

### 3.2 Embedding Pipeline

```typescript
// lib/ai/embeddings.ts
import { Index } from '@upstash/vector';
import OpenAI from 'openai';

const vectorIndex = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL!,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN!,
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function embedProduct(product: Product) {
  const text = `${product.name}. ${product.description}. Age range: ${product.ageRange}. Category: ${product.category}`;

  const embedding = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });

  await vectorIndex.upsert({
    id: `product-${product.id}`,
    vector: embedding.data[0].embedding,
    metadata: {
      type: 'product',
      productId: product.id,
      name: product.name,
      ageRange: product.ageRange,
    }
  });
}

export async function embedAllProducts() {
  const products = await getAllProducts();
  for (const product of products) {
    await embedProduct(product);
  }
}
```

### 3.3 RAG Query

```typescript
// lib/ai/rag.ts
export async function queryWithRAG(userMessage: string) {
  // 1. Embed the user's question
  const queryEmbedding = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: userMessage,
  });

  // 2. Search for relevant products
  const results = await vectorIndex.query({
    vector: queryEmbedding.data[0].embedding,
    topK: 5,
    includeMetadata: true,
  });

  // 3. Fetch full product details
  const productIds = results.map(r => r.metadata.productId);
  const products = await getProductsByIds(productIds);

  // 4. Build context for LLM
  const context = products.map(p =>
    `Product: ${p.name}\nAge Range: ${p.ageRange}\nPrice: ${p.price}\nDescription: ${p.description}\nLink: ${p.affiliateLink}`
  ).join('\n\n');

  return context;
}
```

### 3.4 Update Chat API

```typescript
// api/chat.ts (updated)
export default async function handler(req, res) {
  const { message } = req.body;

  // Get relevant products via RAG
  const productContext = await queryWithRAG(message);

  const systemPrompt = `
You are Maria Montessori, a helpful guide for Montessori Milestones.
Help parents find the right Lovevery products for their child's age.

AVAILABLE PRODUCTS:
${productContext}

Guidelines:
1. Ask for child's age if not provided
2. Recommend the most appropriate product
3. Explain WHY based on Montessori principles
4. Always include the product link
5. Keep responses under 150 words
`;

  const response = await groq.chat.completions.create({
    model: 'llama-3.1-70b-versatile',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message }
    ],
  });

  return res.json({ response: response.choices[0].message.content });
}
```

---

## Phase 4: Admin UI for Products
**Estimated: 3-4 hours**

### 4.1 Products Tab in CMS

Update `CRMSystem.tsx` to fetch/save products from Supabase:

- List all products with toggle (show_on_site)
- Edit product details
- Manage affiliate links per product
- See which link is "winning" based on scoring
- Manual override option

### 4.2 Affiliate Links Management

```tsx
// In product editor
<div>
  <h3>Affiliate Links</h3>
  {product.affiliateLinks.map(link => (
    <div key={link.id}>
      <span>{link.network}</span>
      <span>{link.commissionRate * 100}%</span>
      <span>{link.cookieDays} days</span>
      <span>Score: {calculateEffectiveValue(link).toFixed(4)}</span>
      {link.id === bestLinkId && <Badge>ACTIVE</Badge>}
    </div>
  ))}
  <Button onClick={addAffiliateLink}>Add Link</Button>
</div>
```

### 4.3 Affiliate Settings Page

- Strategy selector (dropdown)
- Network priority (drag to reorder)
- View click analytics

---

## Phase 5: Awin Integration
**Estimated: 2-3 hours**

### 5.1 Get Awin Credentials

When approved:
- Publisher ID
- API Key
- Advertiser IDs for brands (The Woobles, etc.)

### 5.2 Add Environment Variables

```
AWIN_PUBLISHER_ID=xxx
AWIN_API_KEY=xxx
```

### 5.3 Product Feed Sync

Awin uses CSV feeds, not REST API:
- Fetch product feed URL from Awin dashboard
- Parse CSV and sync to Supabase
- Create affiliate links for matching products

---

## Environment Variables Summary

Add to Vercel when ready:

```env
# Existing
GROQ_API_KEY=xxx
VITE_SUPABASE_URL=xxx
VITE_SUPABASE_ANON_KEY=xxx
VITE_ADMIN_EMAILS=xxx

# New - Database (server-side)
SUPABASE_SERVICE_ROLE_KEY=xxx

# New - Vector DB
UPSTASH_VECTOR_REST_URL=xxx
UPSTASH_VECTOR_REST_TOKEN=xxx

# New - Embeddings
OPENAI_API_KEY=xxx

# New - Affiliate Networks (when approved)
IMPACT_ACCOUNT_SID=xxx
IMPACT_AUTH_TOKEN=xxx
AWIN_PUBLISHER_ID=xxx
AWIN_API_KEY=xxx
```

---

## Implementation Order

| Phase | Task | Time | Dependencies |
|-------|------|------|--------------|
| 1.1 | Create Supabase tables | 1h | None |
| 1.2 | Seed product data | 1h | 1.1 |
| 1.3 | Supabase client setup | 30m | 1.1 |
| 2.1 | Port scoring logic | 1h | None |
| 2.2 | Products API endpoint | 1h | 1.3, 2.1 |
| 2.3 | Click tracking | 1h | 2.2 |
| 3.1 | Upstash Vector setup | 30m | None |
| 3.2 | Embedding pipeline | 2h | 3.1, 1.2 |
| 3.3 | RAG query function | 1.5h | 3.2 |
| 3.4 | Update chat API | 1h | 3.3 |
| 4.1 | Products tab in CMS | 2h | 2.2 |
| 4.2 | Affiliate links UI | 1.5h | 4.1, 2.1 |
| 4.3 | Settings page | 1h | 4.1 |
| 5.1-5.3 | Awin integration | 2h | When approved |

**Total Estimated Time: 15-18 hours**

---

## Success Criteria

- [ ] Products stored in Supabase, not constants.tsx
- [ ] Shop page displays products from database
- [ ] Affiliate links auto-selected by scoring algorithm
- [ ] Admin can toggle products on/off, manage links
- [ ] Chatbot uses RAG to find relevant products
- [ ] Click tracking records all affiliate clicks
- [ ] Ready to add Awin when approved

---

## Files to Create/Modify

**New Files:**
```
lib/supabase-db.ts          # Server-side Supabase client
lib/database.types.ts       # Generated types from Supabase
lib/affiliate/scoring.ts    # Link scoring functions
lib/affiliate/types.ts      # Affiliate type definitions
lib/ai/embeddings.ts        # Upstash Vector integration
lib/ai/rag.ts              # RAG query logic
api/products.ts            # Products API with scoring
api/track-click.ts         # Click tracking + redirect
```

**Modified Files:**
```
api/chat.ts                # Add RAG context
components/CRMSystem.tsx   # Products management UI
App.tsx                    # Fetch products from API
constants.tsx              # Remove (or keep as fallback)
```
