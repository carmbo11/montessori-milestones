/**
 * API endpoint to seed products into the vector database
 * Run once to populate the Upstash hybrid index with product embeddings
 *
 * POST /api/seed-vectors
 * Header: x-seed-secret: <first 20 chars of SUPABASE_SERVICE_ROLE_KEY>
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { upsertDocuments } from '../lib/vectorSearch';

// Extended Lovevery Play Kit catalog with rich descriptions for better embeddings
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Simple auth check - require a secret header
  const authHeader = req.headers['x-seed-secret'];
  const seedSecret = process.env.SEED_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 20);

  if (!authHeader || authHeader !== seedSecret) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    console.log('Starting vector seeding...');

    // Prepare documents for vector indexing
    // Combine multiple fields for richer embeddings
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

    console.log(`Upserting ${documents.length} products to vector index...`);

    // Upsert all documents with hybrid embeddings
    await upsertDocuments(documents);

    console.log('Vector seeding complete!');

    return res.status(200).json({
      success: true,
      message: `Successfully seeded ${documents.length} products to vector index`,
      products: PRODUCTS.map((p) => ({ id: p.id, name: p.name })),
    });
  } catch (error) {
    console.error('Vector seeding error:', error);
    return res.status(500).json({
      error: 'Failed to seed vector database',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
