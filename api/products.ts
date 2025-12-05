import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { selectBestLink, getLinkEffectiveValue, type ScoringStrategy } from '../lib/affiliate/scoring';
import type { Product, AffiliateLink, AffiliateSettings } from '../lib/database.types';

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
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get query params for filtering
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

    // Apply filters
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

    // Fetch affiliate links for all products
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

      // Optionally include all links with their scores
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
