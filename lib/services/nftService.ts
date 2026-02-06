// =====================================================
// NFT SERVICE - DATA ACCESS LAYER
// Clean interface for fetching NFTs from Supabase
// =====================================================

import { supabase } from '../supabase/client';
import type { NFTWithAttributes } from '../supabase/types';

/**
 * Get all NFTs from database
 * @param orderBy Sort order (default: newest first)
 * @returns Array of NFTs with attributes
 */
export async function getAllNFTs(
  orderBy: 'newest' | 'oldest' = 'newest'
): Promise<NFTWithAttributes[]> {
  try {
    const { data: nfts, error: nftsError } = await supabase
      .from('nfts')
      .select('*')
      .order('minted_at', { ascending: orderBy === 'oldest' });

    if (nftsError) {
      console.error('Error fetching NFTs:', nftsError);
      throw new Error(`Failed to fetch NFTs: ${nftsError.message}`);
    }

    if (!nfts || nfts.length === 0) {
      return [];
    }

    // Get attributes for all NFTs
    const nftIds = nfts.map((nft) => nft.id);
    const { data: attributes, error: attrError } = await supabase
      .from('nft_attributes')
      .select('*')
      .in('nft_id', nftIds);

    if (attrError) {
      console.error('Error fetching attributes:', attrError);
      // Return NFTs without attributes rather than failing
      return nfts.map((nft) => ({ ...nft, attributes: [] }));
    }

    // Combine NFTs with their attributes
    const nftsWithAttributes: NFTWithAttributes[] = nfts.map((nft) => ({
      ...nft,
      attributes: attributes?.filter((attr) => attr.nft_id === nft.id) || [],
    }));

    return nftsWithAttributes;
  } catch (error: any) {
    console.error('Error in getAllNFTs:', error);
    return [];
  }
}

/**
 * Get trending/recent NFTs
 * @param limit Number of NFTs to return
 * @returns Array of trending NFTs
 */
export async function getTrendingNFTs(limit: number = 6): Promise<NFTWithAttributes[]> {
  try {
    // Get most recent mints as "trending"
    const { data: nfts, error: nftsError } = await supabase
      .from('nfts')
      .select('*')
      .order('minted_at', { ascending: false })
      .limit(limit);

    if (nftsError) {
      console.error('Error fetching trending NFTs:', nftsError);
      return [];
    }

    if (!nfts || nfts.length === 0) {
      return [];
    }

    // Get attributes
    const nftIds = nfts.map((nft) => nft.id);
    const { data: attributes } = await supabase
      .from('nft_attributes')
      .select('*')
      .in('nft_id', nftIds);

    return nfts.map((nft) => ({
      ...nft,
      attributes: attributes?.filter((attr) => attr.nft_id === nft.id) || [],
    }));
  } catch (error: any) {
    console.error('Error in getTrendingNFTs:', error);
    return [];
  }
}

/**
 * Get NFT by database ID
 * @param id Database UUID
 * @returns NFT with attributes or null
 */
export async function getNFTById(id: string): Promise<NFTWithAttributes | null> {
  try {
    const { data: nft, error: nftError } = await supabase
      .from('nfts')
      .select('*')
      .eq('id', id)
      .single();

    if (nftError) {
      if (nftError.code === 'PGRST116') {
        // Not found
        return null;
      }
      console.error('Error fetching NFT:', nftError);
      throw new Error(`Failed to fetch NFT: ${nftError.message}`);
    }

    // Get attributes
    const { data: attributes } = await supabase
      .from('nft_attributes')
      .select('*')
      .eq('nft_id', nft.id);

    return {
      ...nft,
      attributes: attributes || [],
    };
  } catch (error: any) {
    console.error('Error in getNFTById:', error);
    return null;
  }
}

/**
 * Get NFT by token ID and contract address
 * @param tokenId Token ID from blockchain
 * @param contractAddress Contract address
 * @param chainId Chain ID (default: Sepolia)
 * @returns NFT with attributes or null
 */
export async function getNFTByTokenId(
  tokenId: string,
  contractAddress: string,
  chainId: number = 11155111
): Promise<NFTWithAttributes | null> {
  try {
    const { data: nft, error: nftError } = await supabase
      .from('nfts')
      .select('*')
      .eq('token_id', tokenId)
      .eq('contract_address', contractAddress.toLowerCase())
      .eq('chain_id', chainId)
      .single();

    if (nftError) {
      if (nftError.code === 'PGRST116') {
        return null;
      }
      console.error('Error fetching NFT:', nftError);
      throw new Error(`Failed to fetch NFT: ${nftError.message}`);
    }

    // Get attributes
    const { data: attributes } = await supabase
      .from('nft_attributes')
      .select('*')
      .eq('nft_id', nft.id);

    return {
      ...nft,
      attributes: attributes || [],
    };
  } catch (error: any) {
    console.error('Error in getNFTByTokenId:', error);
    return null;
  }
}

/**
 * Get NFTs owned by a wallet address
 * @param walletAddress Wallet address
 * @returns Array of NFTs owned by wallet
 */
export async function getNFTsByWallet(walletAddress: string): Promise<NFTWithAttributes[]> {
  try {
    const normalizedAddress = walletAddress.toLowerCase();

    const { data: nfts, error: nftsError } = await supabase
      .from('nfts')
      .select('*')
      .eq('owner_wallet', normalizedAddress)
      .order('minted_at', { ascending: false });

    if (nftsError) {
      console.error('Error fetching wallet NFTs:', nftsError);
      return [];
    }

    if (!nfts || nfts.length === 0) {
      return [];
    }

    // Get attributes
    const nftIds = nfts.map((nft) => nft.id);
    const { data: attributes } = await supabase
      .from('nft_attributes')
      .select('*')
      .in('nft_id', nftIds);

    return nfts.map((nft) => ({
      ...nft,
      attributes: attributes?.filter((attr) => attr.nft_id === nft.id) || [],
    }));
  } catch (error: any) {
    console.error('Error in getNFTsByWallet:', error);
    return [];
  }
}

/**
 * Get total NFT count
 * @returns Total number of NFTs in database
 */
export async function getTotalNFTCount(): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('nfts')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Error counting NFTs:', error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error('Error in getTotalNFTCount:', error);
    return 0;
  }
}
