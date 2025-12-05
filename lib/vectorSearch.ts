/**
 * Vector Search Utilities for Upstash Hybrid Index
 * Performs hybrid search combining dense (semantic) and sparse (keyword) vectors
 */

import { getHybridEmbedding, type SparseVector } from './embeddings';

export interface SearchResult {
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

interface UpstashQueryResponse {
  result: Array<{
    id: string;
    score: number;
    metadata: Record<string, unknown>;
  }>;
}

/**
 * Search for relevant products/content using hybrid search
 */
export async function hybridSearch(
  query: string,
  topK: number = 5
): Promise<SearchResult[]> {
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

  const data: UpstashQueryResponse = await response.json();

  return data.result.map((item) => ({
    id: item.id,
    score: item.score,
    metadata: item.metadata as SearchResult['metadata'],
  }));
}

/**
 * Upsert a document with hybrid embeddings into the vector index
 */
export async function upsertDocument(
  id: string,
  text: string,
  metadata: Record<string, unknown>
): Promise<void> {
  const upstashUrl = process.env.UPSTASH_VECTOR_REST_URL;
  const upstashToken = process.env.UPSTASH_VECTOR_REST_TOKEN;

  if (!upstashUrl || !upstashToken) {
    throw new Error('Upstash Vector credentials not configured');
  }

  // Generate hybrid embedding
  const { dense, sparse } = await getHybridEmbedding(text);

  // Upsert to Upstash
  const response = await fetch(`${upstashUrl}/upsert`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${upstashToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id,
      vector: dense,
      sparseVector: {
        indices: sparse.indices,
        values: sparse.values,
      },
      metadata,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Upstash upsert error: ${error}`);
  }
}

/**
 * Batch upsert documents with hybrid embeddings
 */
export async function upsertDocuments(
  documents: Array<{
    id: string;
    text: string;
    metadata: Record<string, unknown>;
  }>
): Promise<void> {
  const upstashUrl = process.env.UPSTASH_VECTOR_REST_URL;
  const upstashToken = process.env.UPSTASH_VECTOR_REST_TOKEN;

  if (!upstashUrl || !upstashToken) {
    throw new Error('Upstash Vector credentials not configured');
  }

  // Generate embeddings for all documents in parallel
  const embeddings = await Promise.all(
    documents.map((doc) => getHybridEmbedding(doc.text))
  );

  // Prepare batch upsert payload
  const vectors = documents.map((doc, i) => ({
    id: doc.id,
    vector: embeddings[i].dense,
    sparseVector: {
      indices: embeddings[i].sparse.indices,
      values: embeddings[i].sparse.values,
    },
    metadata: doc.metadata,
  }));

  // Upsert to Upstash
  const response = await fetch(`${upstashUrl}/upsert`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${upstashToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(vectors),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Upstash batch upsert error: ${error}`);
  }
}

/**
 * Delete a document from the vector index
 */
export async function deleteDocument(id: string): Promise<void> {
  const upstashUrl = process.env.UPSTASH_VECTOR_REST_URL;
  const upstashToken = process.env.UPSTASH_VECTOR_REST_TOKEN;

  if (!upstashUrl || !upstashToken) {
    throw new Error('Upstash Vector credentials not configured');
  }

  const response = await fetch(`${upstashUrl}/delete/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${upstashToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Upstash delete error: ${error}`);
  }
}

/**
 * Get index statistics
 */
export async function getIndexStats(): Promise<{
  vectorCount: number;
  pendingVectorCount: number;
  indexSize: number;
  dimension: number;
}> {
  const upstashUrl = process.env.UPSTASH_VECTOR_REST_URL;
  const upstashToken = process.env.UPSTASH_VECTOR_REST_TOKEN;

  if (!upstashUrl || !upstashToken) {
    throw new Error('Upstash Vector credentials not configured');
  }

  const response = await fetch(`${upstashUrl}/info`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${upstashToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Upstash info error: ${error}`);
  }

  const data = await response.json();
  return data.result;
}
