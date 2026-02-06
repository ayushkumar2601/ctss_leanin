-- =====================================================
-- QUICK FIX: Create issues table (compatible with existing code)
-- Run this in Supabase SQL Editor
-- =====================================================

-- Create issues table (replaces nfts)
CREATE TABLE IF NOT EXISTS public.issues (
  -- Primary identification
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_id TEXT NOT NULL,
  
  -- Blockchain data
  contract_address TEXT NOT NULL,
  chain_id INTEGER NOT NULL DEFAULT 11155111,
  mint_tx_hash TEXT NOT NULL UNIQUE,
  
  -- Issue details
  name TEXT NOT NULL,
  description TEXT,
  
  -- Media
  image_url TEXT,
  metadata_uri TEXT,
  
  -- Submission info
  owner_wallet TEXT NOT NULL, -- Kept as owner_wallet for compatibility
  minted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create attributes table
CREATE TABLE IF NOT EXISTS public.nft_attributes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nft_id UUID NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
  trait_type TEXT NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL UNIQUE,
  wallet_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_issues_token_id ON public.issues(token_id);
CREATE INDEX IF NOT EXISTS idx_issues_owner_wallet ON public.issues(owner_wallet);
CREATE INDEX IF NOT EXISTS idx_issues_mint_tx_hash ON public.issues(mint_tx_hash);
CREATE INDEX IF NOT EXISTS idx_issues_minted_at ON public.issues(minted_at DESC);
CREATE INDEX IF NOT EXISTS idx_nft_attributes_nft_id ON public.nft_attributes(nft_id);
CREATE INDEX IF NOT EXISTS idx_users_wallet_address ON public.users(wallet_address);

-- Enable RLS
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nft_attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for issues
CREATE POLICY IF NOT EXISTS "Issues are viewable by everyone"
  ON public.issues FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Authenticated users can insert issues"
  ON public.issues FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- RLS Policies for attributes
CREATE POLICY IF NOT EXISTS "Attributes are viewable by everyone"
  ON public.nft_attributes FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Authenticated users can insert attributes"
  ON public.nft_attributes FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- RLS Policies for users
CREATE POLICY IF NOT EXISTS "Users are viewable by everyone"
  ON public.users FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Anyone can insert users"
  ON public.users FOR INSERT WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Users can update their own data"
  ON public.users FOR UPDATE 
  USING (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

-- Grants
GRANT SELECT, INSERT ON public.issues TO authenticated, anon;
GRANT SELECT, INSERT ON public.nft_attributes TO authenticated, anon;
GRANT SELECT, INSERT, UPDATE ON public.users TO authenticated, anon;

-- Create view for compatibility (nfts -> issues)
CREATE OR REPLACE VIEW public.nfts AS SELECT * FROM public.issues;

-- Grant access to view
GRANT SELECT ON public.nfts TO authenticated, anon;
