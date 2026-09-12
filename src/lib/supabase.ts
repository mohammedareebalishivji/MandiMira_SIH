import { createClient } from '@supabase/supabase-js';

const getEnv = (key: string): string | undefined => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
      return import.meta.env[key] as string;
    }
  } catch {}
  try {
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key];
    }
  } catch {}
  return undefined;
};

const url = getEnv('VITE_SUPABASE_URL');
const anonKey = getEnv('VITE_SUPABASE_ANON_KEY') ?? getEnv('VITE_SUPABASE_PUBLISHABLE_KEY');

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase = createClient(url || 'https://placeholder.supabase.co', anonKey || 'placeholder-key', {
  auth: { persistSession: true, autoRefreshToken: true },
});
