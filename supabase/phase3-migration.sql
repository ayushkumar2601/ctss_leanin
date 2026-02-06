-- =====================================================
-- PHASE 3: MARKETPLACE MIGRATION
-- Run this in Supabase SQL Editor
-- =====================================================

-- =====================================================
-- CREATE MARKETPLACE TABLES
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

-- =====================================================
-- CREATE INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_listings_nft_id ON listings(nft_id);
CREATE INDEX IF NOT EXISTS idx_listings_seller ON listings(seller_wallet);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_active ON listings(status) WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_sales_nft_id ON sales(nft_id);
CREATE INDEX IF NOT EXISTS idx_sales_buyer ON sales(buyer_wallet);
CREATE INDEX IF NOT EXISTS idx_sales_seller ON sales(seller_wallet);
CREATE INDEX IF NOT EXISTS idx_sales_sold_at ON sales(sold_at DESC);

CREATE INDEX IF NOT EXISTS idx_price_history_nft_id ON price_history(nft_id);
CREATE INDEX IF NOT EXISTS idx_price_history_timestamp ON price_history(timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_activity_feed_nft_id ON activity_feed(nft_id);
CREATE INDEX IF NOT EXISTS idx_activity_feed_timestamp ON activity_feed(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_activity_feed_type ON activity_feed(activity_type);

-- =====================================================
-- CREATE TRIGGERS
-- =====================================================

-- Trigger for listings updated_at
CREATE TRIGGER update_listings_updated_at
  BEFORE UPDATE ON listings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- CREATE VIEWS
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
-- DISABLE RLS (for development)
-- =====================================================

ALTER TABLE listings DISABLE ROW LEVEL SECURITY;
ALTER TABLE sales DISABLE ROW LEVEL SECURITY;
ALTER TABLE price_history DISABLE ROW LEVEL SECURITY;
ALTER TABLE activity_feed DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

GRANT ALL ON listings TO anon, authenticated;
GRANT ALL ON sales TO anon, authenticated;
GRANT ALL ON price_history TO anon, authenticated;
GRANT ALL ON activity_feed TO anon, authenticated;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check if tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('listings', 'sales', 'price_history', 'activity_feed');

-- Check if indexes were created
SELECT indexname 
FROM pg_indexes 
WHERE schemaname = 'public' 
AND tablename IN ('listings', 'sales', 'price_history', 'activity_feed');

-- Check if views were created
SELECT table_name 
FROM information_schema.views 
WHERE table_schema = 'public' 
AND table_name IN ('active_listings_view', 'recent_activity_view');
