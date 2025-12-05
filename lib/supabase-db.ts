// Server-side Supabase client with service role key
// Only use this in API routes, never in client code

import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('Supabase server credentials not configured.');
}

// Admin client bypasses Row Level Security
export const supabaseAdmin = createClient<Database>(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseServiceKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);
