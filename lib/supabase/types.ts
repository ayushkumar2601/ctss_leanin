// =====================================================
// SUPABASE DATABASE TYPES
// Auto-generated types for type-safe database access
// =====================================================

export type WalletType = 'metamask' | 'phantom';

export interface User {
  id: string;
  wallet_address: string;
  wallet_type: WalletType;
  created_at: string;
  updated_at: string;
}

export interface NFT {
  id: string;
  token_id: string;
  contract_address: string;
  chain_id: number;
  owner_wallet: string;
  name: string;
  description: string | null;
  image_url: string | null;
  metadata_uri: string | null;
  mint_tx_hash: string;
  minted_at: string;
  created_at: string;
  updated_at: string;
}

export interface NFTAttribute {
  id: string;
  nft_id: string;
  trait_type: string;
  value: string;
  created_at: string;
}

export interface NFTWithAttributes extends NFT {
  attributes: NFTAttribute[];
}

// Insert types (without auto-generated fields)
export type UserInsert = Omit<User, 'id' | 'created_at' | 'updated_at'>;

export type NFTInsert = Omit<NFT, 'id' | 'created_at' | 'updated_at'>;

export type NFTAttributeInsert = Omit<NFTAttribute, 'id' | 'created_at'>;

// Database schema type
export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: UserInsert;
        Update: Partial<UserInsert>;
      };
      nfts: {
        Row: NFT;
        Insert: NFTInsert;
        Update: Partial<NFTInsert>;
      };
      nft_attributes: {
        Row: NFTAttribute;
        Insert: NFTAttributeInsert;
        Update: Partial<NFTAttributeInsert>;
      };
    };
  };
}


// =====================================================
// PHASE 3: MARKETPLACE TYPES
// =====================================================

export type ListingStatus = 'active' | 'sold' | 'cancelled';

export interface Listing {
  id: string;
  nft_id: string;
  token_id: string;
  contract_address: string;
  seller_wallet: string;
  price_eth: string;
  status: ListingStatus;
  tx_hash: string | null;
  created_at: string;
  updated_at: string;
}

export interface ListingInsert {
  nft_id: string;
  token_id: string;
  contract_address: string;
  seller_wallet: string;
  price_eth: string;
  status?: ListingStatus;
  tx_hash?: string | null;
}

export interface ListingWithNFT extends Listing {
  nft: NFTWithAttributes;
}

export interface Sale {
  id: string;
  nft_id: string;
  listing_id: string | null;
  buyer_wallet: string;
  seller_wallet: string;
  price_eth: string;
  platform_fee_eth: string;
  tx_hash: string;
  sold_at: string;
  created_at: string;
}

export interface SaleInsert {
  nft_id: string;
  listing_id?: string | null;
  buyer_wallet: string;
  seller_wallet: string;
  price_eth: string;
  platform_fee_eth: string;
  tx_hash: string;
  sold_at: string;
}

export type PriceEvent = 'listed' | 'sold' | 'delisted' | 'price_updated';

export interface PriceHistory {
  id: string;
  nft_id: string;
  price_eth: string;
  event: PriceEvent;
  from_wallet: string | null;
  to_wallet: string | null;
  tx_hash: string | null;
  timestamp: string;
  created_at: string;
}

export interface PriceHistoryInsert {
  nft_id: string;
  price_eth: string;
  event: PriceEvent;
  from_wallet?: string | null;
  to_wallet?: string | null;
  tx_hash?: string | null;
  timestamp?: string;
}

export type ActivityType = 'minted' | 'listed' | 'sold' | 'delisted' | 'transfer';

export interface ActivityFeed {
  id: string;
  nft_id: string | null;
  activity_type: ActivityType;
  from_wallet: string | null;
  to_wallet: string | null;
  price_eth: string | null;
  tx_hash: string | null;
  timestamp: string;
  created_at: string;
}

export interface ActivityFeedInsert {
  nft_id?: string | null;
  activity_type: ActivityType;
  from_wallet?: string | null;
  to_wallet?: string | null;
  price_eth?: string | null;
  tx_hash?: string | null;
  timestamp?: string;
}

export interface ActivityWithNFT extends ActivityFeed {
  nft?: NFTWithAttributes | null;
}
