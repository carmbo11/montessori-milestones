import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Allow GET (for redirect tracking) or POST (for async tracking)
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get params from query (GET) or body (POST)
    const params = req.method === 'GET' ? req.query : req.body;
    const { productId, linkId, redirect } = params;

    if (!productId || !linkId) {
      return res.status(400).json({ error: 'Missing productId or linkId' });
    }

    // Fetch the affiliate link to get the URL and network
    const { data: link, error: linkError } = await supabase
      .from('affiliate_links')
      .select('url, network')
      .eq('id', linkId)
      .single();

    if (linkError || !link) {
      console.error('Error fetching link:', linkError);
      return res.status(404).json({ error: 'Link not found' });
    }

    // Record the click
    const { error: clickError } = await supabase
      .from('affiliate_clicks')
      .insert({
        product_id: productId as string,
        link_id: linkId as string,
        network: link.network,
        user_agent: req.headers['user-agent'] || null,
        referrer: req.headers['referer'] || null,
      });

    if (clickError) {
      console.error('Error recording click:', clickError);
      // Don't fail the request, just log the error
    }

    // If redirect=true (or GET request), redirect to the affiliate URL
    if (redirect === 'true' || req.method === 'GET') {
      return res.redirect(302, link.url);
    }

    // Otherwise return success
    return res.status(200).json({
      success: true,
      message: 'Click recorded',
      url: link.url
    });

  } catch (error) {
    console.error('Track click error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
