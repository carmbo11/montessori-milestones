// Database types for Supabase tables
// Auto-generated types would normally come from `npx supabase gen types typescript`

export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
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
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          price?: number | null;
          image_url?: string | null;
          age_range?: string | null;
          category?: string | null;
          tags?: string[] | null;
          is_active?: boolean;
          show_on_site?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          price?: number | null;
          image_url?: string | null;
          age_range?: string | null;
          category?: string | null;
          tags?: string[] | null;
          is_active?: boolean;
          show_on_site?: boolean;
          updated_at?: string;
        };
      };
      affiliate_links: {
        Row: {
          id: string;
          product_id: string;
          network: string;
          url: string;
          commission_rate: number | null;
          cookie_days: number | null;
          estimated_conversion: number;
          is_active: boolean;
          last_verified: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          network: string;
          url: string;
          commission_rate?: number | null;
          cookie_days?: number | null;
          estimated_conversion?: number;
          is_active?: boolean;
          last_verified?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          network?: string;
          url?: string;
          commission_rate?: number | null;
          cookie_days?: number | null;
          estimated_conversion?: number;
          is_active?: boolean;
          last_verified?: string | null;
        };
      };
      affiliate_settings: {
        Row: {
          id: string;
          strategy: string;
          network_priority: string[];
          track_clicks: boolean;
          updated_at: string;
        };
        Insert: {
          id?: string;
          strategy?: string;
          network_priority?: string[];
          track_clicks?: boolean;
          updated_at?: string;
        };
        Update: {
          strategy?: string;
          network_priority?: string[];
          track_clicks?: boolean;
          updated_at?: string;
        };
      };
      affiliate_clicks: {
        Row: {
          id: string;
          product_id: string | null;
          link_id: string | null;
          network: string | null;
          clicked_at: string;
          user_agent: string | null;
          referrer: string | null;
        };
        Insert: {
          id?: string;
          product_id?: string | null;
          link_id?: string | null;
          network?: string | null;
          clicked_at?: string;
          user_agent?: string | null;
          referrer?: string | null;
        };
        Update: {
          product_id?: string | null;
          link_id?: string | null;
          network?: string | null;
          user_agent?: string | null;
          referrer?: string | null;
        };
      };
    };
  };
};

// Convenience types
export type Product = Database['public']['Tables']['products']['Row'];
export type ProductInsert = Database['public']['Tables']['products']['Insert'];
export type AffiliateLink = Database['public']['Tables']['affiliate_links']['Row'];
export type AffiliateLinkInsert = Database['public']['Tables']['affiliate_links']['Insert'];
export type AffiliateSettings = Database['public']['Tables']['affiliate_settings']['Row'];
export type AffiliateClick = Database['public']['Tables']['affiliate_clicks']['Row'];
