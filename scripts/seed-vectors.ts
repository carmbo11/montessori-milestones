/**
 * Local script to seed vectors into Upstash
 * Run with: npx tsx scripts/seed-vectors.ts
 */

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

interface SparseVector {
  indices: number[];
  values: number[];
}

interface HybridEmbedding {
  dense: number[];
  sparse: SparseVector;
}

const PRODUCTS = [
  {
    id: 'looker-play-kit',
    name: 'The Looker Play Kit',
    ageRange: '0-12 weeks',
    description: 'High-contrast visuals and sensory exploration tools perfect for building new brain connections. Includes black and white contrast cards, wooden rattle, and cotton mitten set for early visual and tactile development. Ideal for newborns developing their vision and first sensory experiences.',
    affiliateLink: 'https://lovevery.com/products/the-looker-play-kit',
    category: 'play-kit',
    ageMonths: [0, 1, 2, 3],
    keywords: ['newborn', 'infant', 'high contrast', 'black white', 'visual', 'sensory', '0 months', '1 month', '2 months', '3 months'],
  },
  {
    id: 'charmer-play-kit',
    name: 'The Charmer Play Kit',
    ageRange: '3-4 months',
    description: 'Designed for babies starting to reach and grasp. Features a wooden batting ring, silicone teether, and magic tissue box to develop hand-eye coordination and early motor skills. Perfect for babies discovering their hands.',
    affiliateLink: 'https://lovevery.com/products/the-charmer-play-kit',
    category: 'play-kit',
    ageMonths: [3, 4],
    keywords: ['reaching', 'grasping', 'batting', 'teething', 'hand-eye coordination', '3 months', '4 months'],
  },
  {
    id: 'senser-play-kit',
    name: 'The Senser Play Kit',
    ageRange: '5-6 months',
    description: 'Multi-sensory exploration for babies discovering cause and effect. Includes organic cotton ball, rolling bell, and textured fabric book for developing tactile awareness. Great for babies sitting up and exploring textures.',
    affiliateLink: 'https://lovevery.com/products/the-senser-play-kit',
    category: 'play-kit',
    ageMonths: [5, 6],
    keywords: ['sensory', 'textures', 'cause effect', 'sitting', '5 months', '6 months', 'tactile'],
  },
  {
    id: 'inspector-play-kit',
    name: 'The Inspector Play Kit',
    ageRange: '7-8 months',
    description: 'Practice object permanence and explore textures. Includes the famous ball drop box, stacking cups, and texture cards. Perfect for babies learning that objects still exist even when hidden. A Montessori favorite for cognitive development.',
    affiliateLink: 'https://lovevery.com/products/the-inspector-play-kit',
    category: 'play-kit',
    ageMonths: [7, 8],
    keywords: ['object permanence', 'ball drop', 'stacking', 'peek-a-boo', '7 months', '8 months', 'crawling'],
  },
  {
    id: 'explorer-play-kit',
    name: 'The Explorer Play Kit',
    ageRange: '9-10 months',
    description: 'For mobile babies ready to explore. Features nesting felt eggs, wooden peg drop, and first puzzle. Develops fine motor skills and spatial awareness. Perfect for cruising babies.',
    affiliateLink: 'https://lovevery.com/products/the-explorer-play-kit',
    category: 'play-kit',
    ageMonths: [9, 10],
    keywords: ['crawling', 'cruising', 'nesting', 'puzzle', 'fine motor', '9 months', '10 months', 'mobile'],
  },
  {
    id: 'thinker-play-kit',
    name: 'The Thinker Play Kit',
    ageRange: '11-12 months',
    description: 'For babies approaching their first birthday. Includes posting box, first crayon, and wooden stacker. Encourages problem-solving and early creative expression. Celebrates the transition to toddlerhood.',
    affiliateLink: 'https://lovevery.com/products/the-thinker-play-kit',
    category: 'play-kit',
    ageMonths: [11, 12],
    keywords: ['first birthday', 'one year old', 'posting', 'stacking', 'crayon', 'drawing', '11 months', '12 months', '1 year'],
  },
  {
    id: 'babbler-play-kit',
    name: 'The Babbler Play Kit',
    ageRange: '13-15 months',
    description: 'Explore gravity, practice balance, and learn object permanence with the slide and coin bank. Perfect for toddlers developing language and understanding spatial relationships. Includes vocabulary-building activities.',
    affiliateLink: 'https://lovevery.com/products/the-babbler-play-kit',
    category: 'play-kit',
    ageMonths: [13, 14, 15],
    keywords: ['toddler', 'walking', 'language', 'vocabulary', 'coin bank', 'gravity', '13 months', '14 months', '15 months'],
  },
  {
    id: 'pioneer-play-kit',
    name: 'The Pioneer Play Kit',
    ageRange: '16-18 months',
    description: 'For toddlers mastering walking and independence. Features shape puzzle, wooden hammer bench, and everyday helper set for practical life skills development. Supports the "I do it myself" phase.',
    affiliateLink: 'https://lovevery.com/products/the-pioneer-play-kit',
    category: 'play-kit',
    ageMonths: [16, 17, 18],
    keywords: ['independence', 'practical life', 'hammer', 'shapes', 'self-care', '16 months', '17 months', '18 months'],
  },
  {
    id: 'realist-play-kit',
    name: 'The Realist Play Kit',
    ageRange: '19-21 months',
    description: 'Develop precise hand-eye coordination and real-life skills with the lock box and pouring set. Includes felt food and cutting board for imaginative play rooted in reality. Perfect for pretend cooking and practical life.',
    affiliateLink: 'https://lovevery.com/products/the-realist-play-kit',
    category: 'play-kit',
    ageMonths: [19, 20, 21],
    keywords: ['pretend play', 'cooking', 'pouring', 'locks', 'keys', 'practical life', '19 months', '20 months', '21 months'],
  },
  {
    id: 'analyst-play-kit',
    name: 'The Analyst Play Kit',
    ageRange: '22-24 months',
    description: 'Complex problem-solving for almost-two-year-olds. Features gear puzzle, threading beads, and first toolbox for developing logical thinking and fine motor precision. Celebrates the approach to age two.',
    affiliateLink: 'https://lovevery.com/products/the-analyst-play-kit',
    category: 'play-kit',
    ageMonths: [22, 23, 24],
    keywords: ['two year old', 'gears', 'threading', 'tools', 'problem solving', '22 months', '23 months', '24 months', '2 years'],
  },
  {
    id: 'block-set',
    name: 'The Block Set',
    ageRange: '12 months to 4+ years',
    description: 'A brilliant system of 70 solid wood blocks for building spatial awareness, creativity, and engineering thinking. Includes stage-based play guides. A forever toy that grows with your child from toddler through preschool.',
    affiliateLink: 'https://lovevery.com/products/the-block-set',
    category: 'toy',
    ageMonths: [12, 18, 24, 36, 48],
    keywords: ['blocks', 'building', 'wood', 'spatial', 'STEM', 'engineering', 'classic toy', 'open-ended'],
  },
  {
    id: 'book-bundle',
    name: 'Montessori Bookshelf Bundle',
    ageRange: '0-5 years',
    description: "Realistic books reflecting the child's daily life. No fantasy, just relatable experiences that help children understand their world. Board books for babies through chapter-ready books for preschoolers. Perfect for building early literacy.",
    affiliateLink: 'https://lovevery.com/products/book-bundle',
    category: 'books',
    ageMonths: [0, 12, 24, 36, 48, 60],
    keywords: ['books', 'reading', 'realistic', 'literacy', 'board books', 'no fantasy', 'Montessori books'],
  },
];

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getDenseEmbedding(text: string, retries = 3): Promise<number[]> {
  const apiKey = process.env.VOYAGE_API_KEY;
  if (!apiKey) throw new Error('VOYAGE_API_KEY not set');

  for (let attempt = 0; attempt < retries; attempt++) {
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

    if (response.ok) {
      const data = await response.json();
      return data.data[0].embedding;
    }

    const error = await response.text();
    if (error.includes('rate') && attempt < retries - 1) {
      const waitTime = 30000 * (attempt + 1); // 30s, 60s, 90s backoff
      console.log(`  Rate limited, waiting ${waitTime/1000}s before retry...`);
      await sleep(waitTime);
      continue;
    }
    throw new Error(`Voyage API error: ${error}`);
  }
  throw new Error('Max retries exceeded for Voyage API');
}

async function getSparseEmbedding(text: string): Promise<SparseVector> {
  const spladeUrl = process.env.SPLADE_SERVICE_URL;
  if (!spladeUrl) throw new Error('SPLADE_SERVICE_URL not set');

  const response = await fetch(`${spladeUrl}/embed`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`SPLADE error: ${error}`);
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

async function main() {
  console.log('Starting vector seeding...\n');

  const upstashUrl = process.env.UPSTASH_VECTOR_REST_URL;
  const upstashToken = process.env.UPSTASH_VECTOR_REST_TOKEN;

  if (!upstashUrl || !upstashToken) {
    throw new Error('Upstash credentials not configured');
  }

  // Prepare documents
  const documents = PRODUCTS.map((product) => ({
    id: product.id,
    text: [
      product.name,
      `For ages: ${product.ageRange}`,
      product.description,
      `Keywords: ${product.keywords.join(', ')}`,
    ].join('. '),
    metadata: {
      name: product.name,
      description: product.description,
      ageRange: product.ageRange,
      affiliateLink: product.affiliateLink,
      type: 'product',
      category: product.category,
      ageMonths: product.ageMonths,
      keywords: product.keywords,
    },
  }));

  console.log(`Processing ${documents.length} products...\n`);

  // Generate embeddings one at a time with rate limiting (3 RPM = 21s between requests)
  const vectors = [];
  for (let i = 0; i < documents.length; i++) {
    const doc = documents[i];
    console.log(`[${i + 1}/${documents.length}] Embedding: ${doc.metadata.name}`);

    // Add delay between requests to respect 3 RPM rate limit
    if (i > 0) {
      console.log('  (waiting 25s for rate limit...)');
      await sleep(25000);
    }

    const { dense, sparse } = await getHybridEmbedding(doc.text);

    vectors.push({
      id: doc.id,
      vector: dense,
      sparseVector: {
        indices: sparse.indices,
        values: sparse.values,
      },
      metadata: doc.metadata,
    });
  }

  console.log('\nUpserting vectors to Upstash...');

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
    throw new Error(`Upstash upsert error: ${error}`);
  }

  const result = await response.json();
  console.log('\nUpstash response:', JSON.stringify(result, null, 2));
  console.log(`\nSuccessfully seeded ${documents.length} products!`);
}

main().catch(console.error);
