import type { VercelRequest, VercelResponse } from '@vercel/node';

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// ============================================================================
// Types (inlined for Vercel serverless)
// ============================================================================

interface SparseVector {
  indices: number[];
  values: number[];
}

interface HybridEmbedding {
  dense: number[];
  sparse: SparseVector;
}

interface SearchResult {
  id: string;
  score: number;
  metadata: {
    name: string;
    description: string;
    ageRange: string;
    affiliateLink: string;
    type: string;
    [key: string]: unknown;
  };
}

// ============================================================================
// Embedding Functions (inlined)
// ============================================================================

async function getDenseEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.VOYAGE_API_KEY;
  if (!apiKey) {
    throw new Error('VOYAGE_API_KEY not configured');
  }

  const response = await fetch('https://api.voyageai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: [text],
      model: 'voyage-3',
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Voyage API error: ${error}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}

async function getSparseEmbedding(text: string): Promise<SparseVector> {
  const spladeUrl = process.env.SPLADE_SERVICE_URL;
  if (!spladeUrl) {
    throw new Error('SPLADE_SERVICE_URL not configured');
  }

  const response = await fetch(`${spladeUrl}/embed`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`SPLADE service error: ${error}`);
  }

  const data = await response.json();
  return data.sparse_vector;
}

async function getHybridEmbedding(text: string): Promise<HybridEmbedding> {
  const [dense, sparse] = await Promise.all([
    getDenseEmbedding(text),
    getSparseEmbedding(text),
  ]);

  return { dense, sparse };
}

// ============================================================================
// Vector Search Function (inlined)
// ============================================================================

async function hybridSearch(query: string, topK: number = 5): Promise<SearchResult[]> {
  const upstashUrl = process.env.UPSTASH_VECTOR_REST_URL;
  const upstashToken = process.env.UPSTASH_VECTOR_REST_TOKEN;

  if (!upstashUrl || !upstashToken) {
    throw new Error('Upstash Vector credentials not configured');
  }

  // Generate hybrid embedding for the query
  const { dense, sparse } = await getHybridEmbedding(query);

  // Query Upstash with hybrid vectors
  const response = await fetch(`${upstashUrl}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${upstashToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      vector: dense,
      sparseVector: {
        indices: sparse.indices,
        values: sparse.values,
      },
      topK,
      includeMetadata: true,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Upstash query error: ${error}`);
  }

  const data = await response.json();

  return data.result.map((item: { id: string; score: number; metadata: Record<string, unknown> }) => ({
    id: item.id,
    score: item.score,
    metadata: item.metadata as SearchResult['metadata'],
  }));
}

// ============================================================================
// Fallback Products (when RAG unavailable)
// ============================================================================

const FALLBACK_PRODUCTS = [
  { name: 'The Looker Play Kit', ageRange: '0-12 weeks', description: 'High-contrast visuals and sensory exploration tools perfect for building new brain connections.', affiliateLink: 'https://lovevery.com/products/the-looker-play-kit' },
  { name: 'The Inspector Play Kit', ageRange: '7-8 months', description: 'Practice object permanence and explore textures. Includes the famous ball drop box.', affiliateLink: 'https://lovevery.com/products/the-inspector-play-kit' },
  { name: 'The Babbler Play Kit', ageRange: '13-15 months', description: 'Explore gravity, practice balance, and learn object permanence with the slide and coin bank.', affiliateLink: 'https://lovevery.com/products/the-babbler-play-kit' },
  { name: 'The Block Set', ageRange: '12 months to 4+ years', description: 'A brilliant system of solid wood blocks for building spatial awareness. A forever toy.', affiliateLink: 'https://lovevery.com/products/the-block-set' },
];

// ============================================================================
// Context Formatting
// ============================================================================

function formatProductContext(results: SearchResult[]): string {
  return results.map(r =>
    `- Product: "${r.metadata.name}"\n  Age Range: ${r.metadata.ageRange}\n  Description: ${r.metadata.description}\n  Link: ${r.metadata.affiliateLink}`
  ).join('\n\n');
}

function formatFallbackContext(): string {
  return FALLBACK_PRODUCTS.map(p =>
    `- Product: "${p.name}"\n  Age Range: ${p.ageRange}\n  Description: ${p.description}\n  Link: ${p.affiliateLink}`
  ).join('\n\n');
}

// ============================================================================
// Main Handler
// ============================================================================

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  // Use RAG to find relevant products based on user's message
  let inventoryContext: string;
  let searchUsed = false;

  try {
    // Search for relevant products using hybrid vector search
    const searchResults = await hybridSearch(message, 5);

    if (searchResults.length > 0) {
      inventoryContext = formatProductContext(searchResults);
      searchUsed = true;
      console.log(`RAG search found ${searchResults.length} relevant products`);
    } else {
      // No results, use fallback
      inventoryContext = formatFallbackContext();
      console.log('RAG search returned no results, using fallback');
    }
  } catch (searchError) {
    // Vector search failed, use fallback products
    console.error('Vector search error, using fallback:', searchError);
    inventoryContext = formatFallbackContext();
  }

  const systemInstruction = `
    You are Maria Montessori, but reimagined as a helpful digital guide for "Montessori Milestones."
    Your primary goal is to help parents select the *exact right* educational materials for their child's developmental stage, specifically focusing on the Lovevery products in your inventory.

    Here are the most relevant products for this conversation${searchUsed ? ' (found via semantic search)' : ''}:

    ${inventoryContext}

    Guidelines:
    1. **Ask for the Age:** If the user hasn't specified the child's age, politely ask for it to give the best recommendation.
    2. **Match the Stage:** Once you know the age, recommend the specific "Play Kit" or item that fits that age range from the products above.
    3. **Practical Tips:** Explain *why* this product is good for that specific age based on Montessori principles (e.g., object permanence, fine motor skills, order).
    4. **Books:** If the user asks for books, recommend the "Montessori Bookshelf Bundle" or realistic books.
    5. **Links:** Always include the purchase link when mentioning a product. Format it clearly.
    6. **Tone:** Wise, encouraging, grounded, but helpful and commercially aware (you want to help them find the right tool).
    7. **Brevity:** Keep responses under 150 words.
  `;

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: message }
        ],
        temperature: 0.5,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Groq API error:", error);
      return res.status(response.status).json({ error: 'AI service error', details: error });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "I apologize, but I am in deep observation at the moment.";

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Groq Error:", error);
    return res.status(500).json({ error: 'Failed to generate response' });
  }
}
