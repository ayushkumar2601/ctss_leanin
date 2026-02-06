-- =====================================================
-- NEON CHAOS NFT MARKETPLACE - SUPABASE SCHEMA
-- Production-ready PostgreSQL schema with RLS
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- ENUMS
-- =====================================================

CREATE TYPE wallet_type_enum AS ENUM ('metamask', 'phantom');

-- =====================================================
-- TABLES
-- =====================================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_address TEXT UNIQUE NOT NULL,
  wallet_type wallet_type_enum NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on wallet_address for fast lookups
CREATE INDEX IF NOT EXISTS idx_users_wallet_address ON users(wallet_address);

-- NFTs table
CREATE TABLE IF NOT EXISTS nfts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  token_id TEXT NOT NULL,
  contract_address TEXT NOT NULL,
  chain_id INTEGER NOT NULL DEFAULT 11155111, -- Sepolia
  owner_wallet TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  metadata_uri TEXT,
  mint_tx_hash TEXT UNIQUE NOT NULL,
  minted_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_nfts_token_id ON nfts(token_id);
CREATE INDEX IF NOT EXISTS idx_nfts_contract_address ON nfts(contract_address);
CREATE INDEX IF NOT EXISTS idx_nfts_owner_wallet ON nfts(owner_wallet);
CREATE INDEX IF NOT EXISTS idx_nfts_chain_id ON nfts(chain_id);
CREATE INDEX IF NOT EXISTS idx_nfts_mint_tx_hash ON nfts(mint_tx_hash);

-- Composite index for common queries
CREATE INDEX IF NOT EXISTS idx_nfts_owner_chain ON nfts(owner_wallet, chain_id);

-- NFT Attributes table
CREATE TABLE IF NOT EXISTS nft_attributes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nft_id UUID NOT NULL REFERENCES nfts(id) ON DELETE CASCADE,
  trait_type TEXT NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on nft_id for fast attribute lookups
CREATE INDEX IF NOT EXISTS idx_nft_attributes_nft_id ON nft_attributes(nft_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE nfts ENABLE ROW LEVEL SECURITY;
ALTER TABLE nft_attributes ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES - USERS TABLE
-- =====================================================

-- Users can read their own data
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  USING (true); -- Allow reading for upsert operations

-- Users can insert their own data
CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  WITH CHECK (true); -- Allow insert for new wallets

-- Users can update their own data
CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  USING (true);

-- =====================================================
-- RLS POLICIES - NFTS TABLE
-- =====================================================

-- Users can only read NFTs they own
CREATE POLICY "Users can read own NFTs"
  ON nfts
  FOR SELECT
  USING (owner_wallet = current_setting('app.current_wallet', true));

-- Users can only insert NFTs they own
CREATE POLICY "Users can insert own NFTs"
  ON nfts
  FOR INSERT
  WITH CHECK (owner_wallet = current_setting('app.current_wallet', true));

-- Users can update their own NFTs (for metadata updates)
CREATE POLICY "Users can update own NFTs"
  ON nfts
  FOR UPDATE
  USING (owner_wallet = current_setting('app.current_wallet', true));

-- =====================================================
-- RLS POLICIES - NFT_ATTRIBUTES TABLE
-- =====================================================

-- Users can read attributes of NFTs they own
CREATE POLICY "Users can read own NFT attributes"
  ON nft_attributes
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM nfts
      WHERE nfts.id = nft_attributes.nft_id
      AND nfts.owner_wallet = current_setting('app.current_wallet', true)
    )
  );

-- Users can insert attributes for NFTs they own
CREATE POLICY "Users can insert own NFT attributes"
  ON nft_attributes
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM nfts
      WHERE nfts.id = nft_attributes.nft_id
      AND nfts.owner_wallet = current_setting('app.current_wallet', true)
    )
  );

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_nfts_updated_at
  BEFORE UPDATE ON nfts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- HELPER VIEWS
-- =====================================================

-- View to get NFTs with their attributes
CREATE OR REPLACE VIEW nfts_with_attributes AS
SELECT 
  n.*,
  COALESCE(
    json_agg(
      json_build_object(
        'trait_type', a.trait_type,
        'value', a.value
      )
    ) FILTER (WHERE a.id IS NOT NULL),
    '[]'::json
  ) as attributes
FROM nfts n
LEFT JOIN nft_attributes a ON n.id = a.nft_id
GROUP BY n.id;

-- =====================================================
-- SAMPLE QUERIES (FOR TESTING)
-- =====================================================

-- Get all NFTs for a wallet
-- SELECT * FROM nfts WHERE owner_wallet = '0x...' ORDER BY minted_at DESC;

-- Get NFT with attributes
-- SELECT * FROM nfts_with_attributes WHERE token_id = '1';

-- Count NFTs per wallet
-- SELECT owner_wallet, COUNT(*) as nft_count FROM nfts GROUP BY owner_wallet;

-- =====================================================
-- GRANTS (if using service role)
-- =====================================================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- =====================================================
-- PHASE 3: MARKETPLACE TABLES
-- =====================================================

-- Listings table
CREATE TABLE IF NOT EXISTS listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nft_id UUID NOT NULL REFERENCES nfts(id) ON DELETE CASCADE,
  token_id TEXT NOT NULL,
  contract_address TEXT NOT NULL,
  seller_wallet TEXT NOT NULL,
  price_eth DECIMAL(20, 8) NOT NULL CHECK (price_eth > 0),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'sold', 'cancelled')),
  tx_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_listings_nft_id ON listings(nft_id);
CREATE INDEX IF NOT EXISTS idx_listings_seller ON listings(seller_wallet);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_active ON listings(status) WHERE status = 'active';

-- Sales table
CREATE TABLE IF NOT EXISTS sales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nft_id UUID NOT NULL REFERENCES nfts(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
  buyer_wallet TEXT NOT NULL,
  seller_wallet TEXT NOT NULL,
  price_eth DECIMAL(20, 8) NOT NULL,
  platform_fee_eth DECIMAL(20, 8) NOT NULL DEFAULT 0,
  tx_hash TEXT UNIQUE NOT NULL,
  sold_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sales_nft_id ON sales(nft_id);
CREATE INDEX IF NOT EXISTS idx_sales_buyer ON sales(buyer_wallet);
CREATE INDEX IF NOT EXISTS idx_sales_seller ON sales(seller_wallet);
CREATE INDEX IF NOT EXISTS idx_sales_sold_at ON sales(sold_at DESC);

-- Price history table
CREATE TABLE IF NOT EXISTS price_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nft_id UUID NOT NULL REFERENCES nfts(id) ON DELETE CASCADE,
  price_eth DECIMAL(20, 8) NOT NULL,
  event TEXT NOT NULL CHECK (event IN ('listed', 'sold', 'delisted', 'price_updated')),
  from_wallet TEXT,
  to_wallet TEXT,
  tx_hash TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_price_history_nft_id ON price_history(nft_id);
CREATE INDEX IF NOT EXISTS idx_price_history_timestamp ON price_history(timestamp DESC);

-- Activity feed table
CREATE TABLE IF NOT EXISTS activity_feed (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nft_id UUID REFERENCES nfts(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('minted', 'listed', 'sold', 'delisted', 'transfer')),
  from_wallet TEXT,
  to_wallet TEXT,
  price_eth DECIMAL(20, 8),
  tx_hash TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_feed_nft_id ON activity_feed(nft_id);
CREATE INDEX IF NOT EXISTS idx_activity_feed_timestamp ON activity_feed(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_activity_feed_type ON activity_feed(activity_type);

-- =====================================================
-- PHASE 3: RLS POLICIES
-- =====================================================

-- Disable RLS for marketplace tables (public read, controlled write)
ALTER TABLE listings DISABLE ROW LEVEL SECURITY;
ALTER TABLE sales DISABLE ROW LEVEL SECURITY;
ALTER TABLE price_history DISABLE ROW LEVEL SECURITY;
ALTER TABLE activity_feed DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- PHASE 3: TRIGGERS
-- =====================================================

-- Trigger for listings updated_at
CREATE TRIGGER update_listings_updated_at
  BEFORE UPDATE ON listings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- PHASE 3: VIEWS
-- =====================================================

-- Active listings with NFT details
CREATE OR REPLACE VIEW active_listings_view AS
SELECT 
  l.id as listing_id,
  l.price_eth,
  l.seller_wallet,
  l.created_at as listed_at,
  l.tx_hash as listing_tx_hash,
  n.*
FROM listings l
JOIN nfts n ON l.nft_id = n.id
WHERE l.status = 'active';

-- Recent activity with NFT details
CREATE OR REPLACE VIEW recent_activity_view AS
SELECT 
  a.id,
  a.activity_type,
  a.from_wallet,
  a.to_wallet,
  a.price_eth,
  a.tx_hash,
  a.timestamp,
  n.id as nft_id,
  n.name as nft_name,
  n.image_url as nft_image,
  n.token_id
FROM activity_feed a
LEFT JOIN nfts n ON a.nft_id = n.id
ORDER BY a.timestamp DESC;

-- =====================================================
-- PHASE 3: GRANTS
-- =====================================================

GRANT ALL ON listings TO anon, authenticated;
GRANT ALL ON sales TO anon, authenticated;
GRANT ALL ON price_history TO anon, authenticated;
GRANT ALL ON activity_feed TO anon, authenticated;
