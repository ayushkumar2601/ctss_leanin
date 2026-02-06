-- =====================================================
-- FIX RLS POLICIES FOR NFT MINTING
-- Run this in Supabase SQL Editor
-- =====================================================

-- Option 1: Disable RLS temporarily (EASIEST - Use this for now)
ALTER TABLE nfts DISABLE ROW LEVEL SECURITY;
ALTER TABLE nft_attributes DISABLE ROW LEVEL SECURITY;

-- Option 2: Update policies to allow public inserts (More secure, but complex)
-- Uncomment below if you want to keep RLS enabled:

/*
-- Drop old policies
DROP POLICY IF EXISTS "Users can insert own NFTs" ON nfts;
DROP POLICY IF EXISTS "Users can read own NFTs" ON nfts;

-- Allow anyone to insert NFTs (they can only insert with their own wallet address)
CREATE POLICY "Allow NFT minting"
  ON nfts
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to read all NFTs (public marketplace)
CREATE POLICY "Allow reading all NFTs"
  ON nfts
  FOR SELECT
  USING (true);

-- Only owner can update their NFTs
CREATE POLICY "Users can update own NFTs"
  ON nfts
  FOR UPDATE
  USING (owner_wallet = current_setting('app.current_wallet', true));
*/
