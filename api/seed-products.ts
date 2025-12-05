import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// Products data from constants.tsx
const PRODUCTS = [
  {
    name: 'The Looker Play Kit',
    price: 80.00,
    description: 'High-contrast visuals and sensory exploration tools perfect for building new brain connections.',
    image_url: 'https://www.lovevery.com/cdn/shop/files/Desktop_ShopPage_ProductCard_Looker_5b97e1ac-7a6a-4b1f-b1bc-5b3fdef7c94b.png?v=1741631704',
    age_range: '0-12 weeks',
    category: 'Play Kit',
    tags: ['newborn', 'sensory', 'visual'],
    affiliate_url: 'https://lovevery.com/products/the-looker-play-kit'
  },
  {
    name: 'The Inspector Play Kit',
    price: 80.00,
    description: 'Practice object permanence and explore textures. Includes the famous ball drop box.',
    image_url: 'https://www.lovevery.com/cdn/shop/files/Desktop_ShopPage_ProductCard_Inspector_7f76efb0-7c9e-4fd7-91ac-cc8893e3e3c5.png?v=1741631704',
    age_range: '7-8 months',
    category: 'Play Kit',
    tags: ['infant', 'object-permanence', 'textures'],
    affiliate_url: 'https://lovevery.com/products/the-inspector-play-kit'
  },
  {
    name: 'The Babbler Play Kit',
    price: 120.00,
    description: 'Explore gravity, practice balance, and learn object permanence with the slide and coin bank.',
    image_url: 'https://www.lovevery.com/cdn/shop/files/Desktop_ShopPage_ProductCard_Babbler_fc7e5df7-d8de-4e52-acb9-8c5b79b0ed0e.png?v=1741631703',
    age_range: '13-15 months',
    category: 'Play Kit',
    tags: ['toddler', 'motor-skills', 'balance'],
    affiliate_url: 'https://lovevery.com/products/the-babbler-play-kit'
  },
  {
    name: 'The Realist Play Kit',
    price: 120.00,
    description: 'Develop precise hand-eye coordination and real-life skills with the lock box and pouring set.',
    image_url: 'https://www.lovevery.com/cdn/shop/files/Desktop_ShopPage_ProductCard_Realist_0e66821a-17be-4f39-b0f6-05a0f9d2f0a3.png?v=1741631704',
    age_range: '19-21 months',
    category: 'Play Kit',
    tags: ['toddler', 'practical-life', 'fine-motor'],
    affiliate_url: 'https://lovevery.com/products/the-realist-play-kit'
  },
  {
    name: 'The Block Set',
    price: 90.00,
    description: 'A brilliant system of solid wood blocks for building spatial awareness. A forever toy.',
    image_url: 'https://www.lovevery.com/cdn/shop/files/Desktop_ShopPage_ProductCard_BlockSet.png?v=1741631703',
    age_range: '12 months - 4+ years',
    category: 'Toys',
    tags: ['blocks', 'spatial', 'building', 'classic'],
    affiliate_url: 'https://lovevery.com/products/the-block-set'
  },
  {
    name: 'Montessori Bookshelf Bundle',
    price: 30.00,
    description: "Realistic books reflecting the child's daily life. No fantasy, just relatable experiences.",
    image_url: 'https://www.lovevery.com/cdn/shop/files/ShopPage_ProductCard_Books.png?v=1741631703',
    age_range: '0-5 years',
    category: 'Books',
    tags: ['books', 'reading', 'realistic'],
    affiliate_url: 'https://lovevery.com/products/the-reading-skill-set'
  }
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests with a secret key
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Simple security: require a secret header
  const authHeader = req.headers['x-seed-secret'];
  if (authHeader !== process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 20)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({ error: 'Missing Supabase credentials' });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const results = {
      products: [] as string[],
      links: [] as string[],
      errors: [] as string[]
    };

    for (const product of PRODUCTS) {
      // Insert product
      const { data: productData, error: productError } = await supabase
        .from('products')
        .upsert({
          name: product.name,
          description: product.description,
          price: product.price,
          image_url: product.image_url,
          age_range: product.age_range,
          category: product.category,
          tags: product.tags,
          is_active: true,
          show_on_site: true
        }, {
          onConflict: 'name'
        })
        .select()
        .single();

      if (productError) {
        results.errors.push(`Product "${product.name}": ${productError.message}`);
        continue;
      }

      results.products.push(product.name);

      // Insert affiliate link for this product
      if (productData) {
        const { error: linkError } = await supabase
          .from('affiliate_links')
          .upsert({
            product_id: productData.id,
            network: 'impact',
            url: product.affiliate_url,
            commission_rate: 0.10, // 10% estimate for Lovevery
            cookie_days: 30,
            estimated_conversion: 0.03,
            is_active: true
          }, {
            onConflict: 'product_id,network'
          });

        if (linkError) {
          results.errors.push(`Link for "${product.name}": ${linkError.message}`);
        } else {
          results.links.push(`${product.name} (impact)`);
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: `Seeded ${results.products.length} products and ${results.links.length} affiliate links`,
      results
    });

  } catch (error) {
    console.error('Seed error:', error);
    return res.status(500).json({
      error: 'Failed to seed database',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
