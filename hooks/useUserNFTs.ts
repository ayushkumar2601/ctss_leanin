// =====================================================
// USE USER NFTS HOOK
// React hook to fetch and manage user's NFTs
// =====================================================

import { useState, useEffect } from 'react';
import { getUserNFTs } from '../lib/supabase/nft-service';
import type { NFTWithAttributes } from '../lib/supabase/types';

interface UseUserNFTsResult {
  nfts: NFTWithAttributes[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch NFTs for a connected wallet
 * Auto-refetches when wallet address changes
 */
export function useUserNFTs(walletAddress: string | null): UseUserNFTsResult {
  const [nfts, setNfts] = useState<NFTWithAttributes[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNFTs = async () => {
    if (!walletAddress) {
      setNfts([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await getUserNFTs(walletAddress);
      setNfts(data);
    } catch (err: any) {
      console.error('Error fetching NFTs:', err);
      setError(err.message || 'Failed to fetch NFTs');
      setNfts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch on mount and when wallet changes
  useEffect(() => {
    fetchNFTs();
  }, [walletAddress]);

  return {
    nfts,
    isLoading,
    error,
    refetch: fetchNFTs,
  };
}
