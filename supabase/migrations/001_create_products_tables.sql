-- Montessori Milestones Database Schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/coqjqsjfilptvhhfttsj/sql

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  price DECIMAL(10,2),
  image_url TEXT,
  age_range TEXT,
  category TEXT,
  tags TEXT[],
  is_active BOOLEAN DEFAULT true,
  show_on_site BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Affiliate links (multiple per product)
CREATE TABLE IF NOT EXISTS affiliate_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  network TEXT NOT NULL, -- 'impact', 'awin', 'amazon', etc.
  url TEXT NOT NULL,
  commission_rate DECIMAL(5,4), -- 0.1000 = 10%
  cookie_days INTEGER,
  estimated_conversion DECIMAL(5,4) DEFAULT 0.03,
  is_active BOOLEAN DEFAULT true,
  last_verified TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, network)
);

-- Affiliate settings (site-level config)
CREATE TABLE IF NOT EXISTS affiliate_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  strategy TEXT DEFAULT 'highest_effective_value',
  network_priority TEXT[] DEFAULT ARRAY['impact', 'awin', 'amazon'],
  track_clicks BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Click tracking
CREATE TABLE IF NOT EXISTS affiliate_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id),
  link_id UUID REFERENCES affiliate_links(id),
  network TEXT,
  clicked_at TIMESTAMPTZ DEFAULT NOW(),
  user_agent TEXT,
  referrer TEXT
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_age_range ON products(age_range);
CREATE INDEX IF NOT EXISTS idx_products_show_on_site ON products(show_on_site);
CREATE INDEX IF NOT EXISTS idx_affiliate_links_product_id ON affiliate_links(product_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_product_id ON affiliate_clicks(product_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_clicked_at ON affiliate_clicks(clicked_at);

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Allow public read for products/links, admin write via service key
CREATE POLICY "Public can read active products" ON products
  FOR SELECT USING (is_active = true AND show_on_site = true);

CREATE POLICY "Service role can do everything on products" ON products
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Public can read active affiliate links" ON affiliate_links
  FOR SELECT USING (is_active = true);

CREATE POLICY "Service role can do everything on affiliate_links" ON affiliate_links
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can do everything on affiliate_settings" ON affiliate_settings
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can do everything on affiliate_clicks" ON affiliate_clicks
  FOR ALL USING (auth.role() = 'service_role');

-- Allow clicks to be inserted by anyone (for tracking)
CREATE POLICY "Anyone can insert clicks" ON affiliate_clicks
  FOR INSERT WITH CHECK (true);

-- Insert default affiliate settings
INSERT INTO affiliate_settings (strategy, network_priority, track_clicks)
VALUES ('highest_effective_value', ARRAY['impact', 'awin', 'amazon'], true)
ON CONFLICT DO NOTHING;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
