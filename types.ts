
export interface NFT {
  id: string;
  title: string;
  creator: string;
  price: number;
  image: string;
  rarity: 'Common' | 'Rare' | 'Legendary' | 'Artifact';
  tags: string[];
  vibeTags: string[];
  trending?: boolean;
  aiPriced?: boolean;
  aiConfidence?: number;
  aiDemand?: 'Low' | 'Medium' | 'High';
  creatorScore?: number;
  aiExplanation?: string[];
  authenticityStatus?: 'Verified' | 'Warning' | 'Pending';
  matchmakingPersonas?: string[];
  projectedPrices?: { name: string; min: number; max: number }[];
}

export interface ActivityEvent {
  id: string;
  type: 'MINT' | 'SALE' | 'BID';
  user: string;
  nftTitle: string;
  price?: number;
  timestamp: string;
}

export interface User {
  username: string;
  avatar: string;
  walletAddress: string;
}
