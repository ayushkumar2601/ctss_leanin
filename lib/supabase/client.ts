// =====================================================
// SUPABASE CLIENT
// Singleton client instance with type safety
// =====================================================

import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local'
  );
}

// Create typed Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // We use wallet-based auth, not Supabase auth
    autoRefreshToken: false,
  },
});

// Helper to set current wallet for RLS
export const setCurrentWallet = (walletAddress: string) => {
  // This sets a session variable that RLS policies can read
  return supabase.rpc('set_config', {
    setting: 'app.current_wallet',
    value: walletAddress,
  });
};
