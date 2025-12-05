import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// Types (inlined for Vercel serverless)
interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  image_url: string | null;
  age_range: string | null;
  category: string | null;
  tags: string[] | null;
  is_active: boolean;
  show_on_site: boolean;
}

interface AffiliateLink {
  id: string;
  product_id: string;
  network: string;
  url: string;
  commission_rate: number | null;
  cookie_days: number | null;
  estimated_conversion: number;
  is_active: boolean;
}

interface AffiliateSettings {
  strategy: string;
  network_priority: string[];
}

type ScoringStrategy = 'highest_commission' | 'highest_effective_value' | 'prefer_direct' | 'manual';

// Scoring functions (inlined)
function calculateEffectiveValue(
  commissionRate: number,
  cookieDays: number,
  conversionRate: number = 0.03
): number {
  const cookieFactor = Math.log(cookieDays + 1) / Math.log(31);
  return commissionRate * cookieFactor * conversionRate;
}

function getLinkEffectiveValue(link: AffiliateLink): number {
  return calculateEffectiveValue(
    link.commission_rate || 0,
    link.cookie_days || 30,
    link.estimated_conversion
  );
}

function selectBestLink(
  links: AffiliateLink[],
  strategy: ScoringStrategy = 'highest_effective_value',
  networkPriority: string[] = ['impact', 'awin', 'amazon']
): AffiliateLink | null {
  const activeLinks = links.filter(link => link.is_active);
  if (activeLinks.length === 0) return null;
  if (activeLinks.length === 1) return activeLinks[0];

  switch (strategy) {
    case 'highest_commission':
      return activeLinks.reduce((best, current) =>
        (current.commission_rate || 0) > (best.commission_rate || 0) ? current : best
      );
    case 'prefer_direct':
      for (const network of networkPriority) {
        const match = activeLinks.find(l => l.network.toLowerCase() === network.toLowerCase());
        if (match) return match;
      }
      // Fall through
    case 'highest_effective_value':
    default:
      return activeLinks.reduce((best, current) => {
        const currentValue = getLinkEffectiveValue(current);
        const bestValue = getLinkEffectiveValue(best);
        return currentValue > bestValue ? current : best;
      });
  }
}

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export interface ProductWithLink extends Product {
  affiliateLink: string | null;
  affiliateLinkId: string | null;
  affiliateNetwork: string | null;
  allLinks?: Array<AffiliateLink & { effectiveValue: number }>;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { category, ageRange, search, includeAllLinks } = req.query;

    // Fetch affiliate settings
    const { data: settingsData } = await supabase
      .from('affiliate_settings')
      .select('*')
      .single();

    const settings: AffiliateSettings | null = settingsData;
    const strategy = (settings?.strategy || 'highest_effective_value') as ScoringStrategy;
    const networkPriority = settings?.network_priority || ['impact', 'awin', 'amazon'];

    // Build products query
    let productsQuery = supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .eq('show_on_site', true);

    if (category && typeof category === 'string') {
      productsQuery = productsQuery.eq('category', category);
    }
    if (ageRange && typeof ageRange === 'string') {
      productsQuery = productsQuery.ilike('age_range', `%${ageRange}%`);
    }
    if (search && typeof search === 'string') {
      productsQuery = productsQuery.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data: products, error: productsError } = await productsQuery;

    if (productsError) {
      console.error('Error fetching products:', productsError);
      return res.status(500).json({ error: 'Failed to fetch products' });
    }

    if (!products || products.length === 0) {
      return res.status(200).json({ products: [], total: 0 });
    }

    // Fetch affiliate links
    const productIds = products.map(p => p.id);
    const { data: allLinks, error: linksError } = await supabase
      .from('affiliate_links')
      .select('*')
      .in('product_id', productIds)
      .eq('is_active', true);

    if (linksError) {
      console.error('Error fetching affiliate links:', linksError);
    }

    // Group links by product_id
    const linksByProduct: Record<string, AffiliateLink[]> = {};
    (allLinks || []).forEach(link => {
      if (!linksByProduct[link.product_id]) {
        linksByProduct[link.product_id] = [];
      }
      linksByProduct[link.product_id].push(link);
    });

    // Map products with best affiliate link
    const productsWithLinks: ProductWithLink[] = products.map(product => {
      const productLinks = linksByProduct[product.id] || [];
      const bestLink = selectBestLink(productLinks, strategy, networkPriority);

      const result: ProductWithLink = {
        ...product,
        affiliateLink: bestLink?.url || null,
        affiliateLinkId: bestLink?.id || null,
        affiliateNetwork: bestLink?.network || null,
      };

      if (includeAllLinks === 'true') {
        result.allLinks = productLinks.map(link => ({
          ...link,
          effectiveValue: getLinkEffectiveValue(link)
        })).sort((a, b) => b.effectiveValue - a.effectiveValue);
      }

      return result;
    });

    return res.status(200).json({
      products: productsWithLinks,
      total: productsWithLinks.length,
      strategy,
      source: 'supabase'
    });

  } catch (error) {
    console.error('Products API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
