import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not configured. Admin auth will not work.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

// Get whitelisted admin emails from env
export const getAdminEmails = (): string[] => {
  const emails = import.meta.env.VITE_ADMIN_EMAILS || '';
  return emails.split(',').map((e: string) => e.trim().toLowerCase()).filter(Boolean);
};

export const isEmailWhitelisted = (email: string): boolean => {
  const adminEmails = getAdminEmails();
  return adminEmails.includes(email.toLowerCase());
};
