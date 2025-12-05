import type { VercelRequest, VercelResponse } from '@vercel/node';

const IMPACT_API_BASE = 'https://api.impact.com/Mediapartners';

// Mock data for development/testing (used when API credentials not available)
const MOCK_PRODUCTS = [
  {
    id: 'lovevery-looker',
    name: 'The Looker Play Kit',
    price: '$80',
    description: 'High-contrast images and sensory play for newborns 0-12 weeks. Includes black & white cards, wooden rattle, and more.',
    imageUrl: 'https://cdn.lovevery.com/images/play-kits/looker-kit.jpg',
    affiliateLink: 'https://lovevery.com/products/the-looker-play-kit',
    ageRange: '0-12 weeks',
    category: 'Play Kits',
  },
  {
    id: 'lovevery-charmer',
    name: 'The Charmer Play Kit',
    price: '$80',
    description: 'Focuses on visual tracking and reaching. Includes play gym accessories and Montessori mobiles.',
    imageUrl: 'https://cdn.lovevery.com/images/play-kits/charmer-kit.jpg',
    affiliateLink: 'https://lovevery.com/products/the-charmer-play-kit',
    ageRange: '3-4 months',
    category: 'Play Kits',
  },
  {
    id: 'lovevery-senser',
    name: 'The Senser Play Kit',
    price: '$80',
    description: 'Develops sensory exploration and cause-effect understanding with textured toys and sound makers.',
    imageUrl: 'https://cdn.lovevery.com/images/play-kits/senser-kit.jpg',
    affiliateLink: 'https://lovevery.com/products/the-senser-play-kit',
    ageRange: '5-6 months',
    category: 'Play Kits',
  },
  {
    id: 'lovevery-inspector',
    name: 'The Inspector Play Kit',
    price: '$80',
    description: 'Object permanence and texture exploration for sitters. Includes peek-a-boo box and sensory balls.',
    imageUrl: 'https://cdn.lovevery.com/images/play-kits/inspector-kit.jpg',
    affiliateLink: 'https://lovevery.com/products/the-inspector-play-kit',
    ageRange: '7-8 months',
    category: 'Play Kits',
  },
  {
    id: 'lovevery-explorer',
    name: 'The Explorer Play Kit',
    price: '$80',
    description: 'For crawlers learning to stand. Wooden push cart, nesting cups, and early problem-solving toys.',
    imageUrl: 'https://cdn.lovevery.com/images/play-kits/explorer-kit.jpg',
    affiliateLink: 'https://lovevery.com/products/the-explorer-play-kit',
    ageRange: '9-10 months',
    category: 'Play Kits',
  },
  {
    id: 'lovevery-thinker',
    name: 'The Thinker Play Kit',
    price: '$80',
    description: 'Problem-solving and first words. Includes shape sorter, first puzzle, and language cards.',
    imageUrl: 'https://cdn.lovevery.com/images/play-kits/thinker-kit.jpg',
    affiliateLink: 'https://lovevery.com/products/the-thinker-play-kit',
    ageRange: '11-12 months',
    category: 'Play Kits',
  },
  {
    id: 'lovevery-babbler',
    name: 'The Babbler Play Kit',
    price: '$120',
    description: 'Cause and effect, balance, and posting activities for new toddlers.',
    imageUrl: 'https://cdn.lovevery.com/images/play-kits/babbler-kit.jpg',
    affiliateLink: 'https://lovevery.com/products/the-babbler-play-kit',
    ageRange: '13-15 months',
    category: 'Play Kits',
  },
  {
    id: 'lovevery-pioneer',
    name: 'The Pioneer Play Kit',
    price: '$120',
    description: 'Walking confidence and spatial awareness with pull toys and stacking activities.',
    imageUrl: 'https://cdn.lovevery.com/images/play-kits/pioneer-kit.jpg',
    affiliateLink: 'https://lovevery.com/products/the-pioneer-play-kit',
    ageRange: '16-18 months',
    category: 'Play Kits',
  },
  {
    id: 'lovevery-realist',
    name: 'The Realist Play Kit',
    price: '$120',
    description: 'Practical life skills, pouring, and precise hand control for toddlers.',
    imageUrl: 'https://cdn.lovevery.com/images/play-kits/realist-kit.jpg',
    affiliateLink: 'https://lovevery.com/products/the-realist-play-kit',
    ageRange: '19-21 months',
    category: 'Play Kits',
  },
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const accountSid = process.env.IMPACT_ACCOUNT_SID;
  const authToken = process.env.IMPACT_AUTH_TOKEN;
  const catalogId = process.env.IMPACT_CATALOG_ID;

  // If no credentials, return mock data
  if (!accountSid || !authToken) {
    console.log('Impact.com credentials not configured, returning mock data');
    return res.status(200).json({
      products: MOCK_PRODUCTS,
      source: 'mock',
      message: 'Using mock data - Impact.com API credentials not configured',
    });
  }

  try {
    // Build the API URL
    const baseUrl = `${IMPACT_API_BASE}/${accountSid}`;
    let url: string;

    if (catalogId) {
      // Fetch items from a specific catalog
      url = `${baseUrl}/Catalogs/${catalogId}/Items`;
    } else {
      // Search all catalog items
      url = `${baseUrl}/Catalogs/ItemSearch`;
    }

    // Add query parameters
    const params = new URLSearchParams({
      PageSize: '100',
    });

    // Optional filters from query string
    const { category, search, ageRange } = req.query;
    if (search) {
      params.append('Query', String(search));
    }

    const fullUrl = `${url}?${params.toString()}`;

    // Make the API request
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Impact API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Map Impact.com items to our product format
    const products = (data.Items || []).map((item: any) => ({
      id: item.Id,
      name: item.Name,
      price: item.Price ? `$${item.Price}` : '',
      description: item.Description || '',
      imageUrl: item.ImageUrl || '',
      affiliateLink: item.TrackingLink || item.ProductUrl || '',
      badge: item.DiscountPercent ? `${item.DiscountPercent}% Off` : undefined,
      ageRange: item.AgeRange || item.Labels?.find((l: string) => l.includes('month') || l.includes('year')),
      category: item.Category,
    }));

    return res.status(200).json({
      products,
      source: 'impact',
      total: data['@total'] || products.length,
      page: data['@page'] || 1,
    });

  } catch (error) {
    console.error('Impact API error:', error);

    // Fall back to mock data on error
    return res.status(200).json({
      products: MOCK_PRODUCTS,
      source: 'mock',
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Falling back to mock data due to API error',
    });
  }
}
