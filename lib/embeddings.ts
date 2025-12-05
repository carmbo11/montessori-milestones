/**
 * Hybrid Embedding Utilities
 * - Voyage-3 for dense embeddings (1024 dimensions)
 * - SPLADE for sparse embeddings (keyword matching)
 */

export interface SparseVector {
  indices: number[];
  values: number[];
}

export interface HybridEmbedding {
  dense: number[];
  sparse: SparseVector;
}

/**
 * Generate dense embedding using Voyage-3
 */
export async function getDenseEmbedding(text: string): Promise<number[]> {
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

/**
 * Generate sparse embedding using SPLADE service
 */
export async function getSparseEmbedding(text: string): Promise<SparseVector> {
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

/**
 * Generate both dense and sparse embeddings for hybrid search
 */
export async function getHybridEmbedding(text: string): Promise<HybridEmbedding> {
  const [dense, sparse] = await Promise.all([
    getDenseEmbedding(text),
    getSparseEmbedding(text),
  ]);

  return { dense, sparse };
}

/**
 * Batch generate dense embeddings (more efficient for multiple texts)
 */
export async function getDenseEmbeddingsBatch(texts: string[]): Promise<number[][]> {
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
      input: texts,
      model: 'voyage-3',
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Voyage API error: ${error}`);
  }

  const data = await response.json();
  return data.data.map((item: { embedding: number[] }) => item.embedding);
}

/**
 * Batch generate sparse embeddings
 */
export async function getSparseEmbeddingsBatch(texts: string[]): Promise<SparseVector[]> {
  const spladeUrl = process.env.SPLADE_SERVICE_URL;
  if (!spladeUrl) {
    throw new Error('SPLADE_SERVICE_URL not configured');
  }

  const response = await fetch(`${spladeUrl}/embed/batch`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ texts }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`SPLADE service error: ${error}`);
  }

  const data = await response.json();
  return data.sparse_vectors;
}

/**
 * Batch generate hybrid embeddings
 */
export async function getHybridEmbeddingsBatch(texts: string[]): Promise<HybridEmbedding[]> {
  const [denseResults, sparseResults] = await Promise.all([
    getDenseEmbeddingsBatch(texts),
    getSparseEmbeddingsBatch(texts),
  ]);

  return texts.map((_, i) => ({
    dense: denseResults[i],
    sparse: sparseResults[i],
  }));
}
