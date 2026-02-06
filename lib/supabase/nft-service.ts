// =====================================================
// NFT SERVICE
// Business logic for NFT operations with Supabase
// =====================================================

import { supabase } from './client';
import type { NFT, NFTInsert, NFTAttribute, NFTAttributeInsert, NFTWithAttributes, UserInsert, WalletType } from './types';

// =====================================================
// USER OPERATIONS
// =====================================================

/**
 * Upsert user on wallet connect
 */
export async function upsertUser(walletAddress: string, walletType: WalletType) {
  const { data, error } = await supabase
    .from('users')
    .upsert(
      {
        wallet_address: walletAddress.toLowerCase(),
        wallet_type: walletType,
      },
      {
        onConflict: 'wallet_address',
      }
    )
    .select()
    .single();

  if (error) {
    console.error('Error upserting user:', error);
    throw new Error(`Failed to save user: ${error.message}`);
  }

  return data;
}

// =====================================================
// NFT OPERATIONS
// =====================================================

/**
 * Save minted NFT to database
 */
export async function saveMintedNFT(nftData: {
  tokenId: string;
  contractAddress: string;
  chainId: number;
  ownerWallet: string;
  name: string;
  description?: string;
  imageUrl?: string;
  metadataUri?: string;
  mintTxHash: string;
  mintedAt: Date;
  attributes?: Array<{ trait_type: string; value: string }>;
}) {
  // Normalize wallet address
  const ownerWallet = nftData.ownerWallet.toLowerCase();

  // Check if NFT already exists (prevent duplicates)
  const { data: existing } = await supabase
    .from('nfts')
    .select('id')
    .eq('mint_tx_hash', nftData.mintTxHash)
    .single();

  if (existing) {
    console.log('NFT already exists:', existing.id);
    return existing;
  }

  // Insert NFT
  const nftInsert: NFTInsert = {
    token_id: nftData.tokenId,
    contract_address: nftData.contractAddress.toLowerCase(),
    chain_id: nftData.chainId,
    owner_wallet: ownerWallet,
    name: nftData.name,
    description: nftData.description || null,
    image_url: nftData.imageUrl || null,
    metadata_uri: nftData.metadataUri || null,
    mint_tx_hash: nftData.mintTxHash,
    minted_at: nftData.mintedAt.toISOString(),
  };

  const { data: nft, error: nftError } = await supabase
    .from('nfts')
    .insert(nftInsert)
    .select()
    .single();

  if (nftError) {
    console.error('Error saving NFT:', nftError);
    throw new Error(`Failed to save NFT: ${nftError.message}`);
  }

  // Insert attributes if provided
  if (nftData.attributes && nftData.attributes.length > 0) {
    const attributeInserts: NFTAttributeInsert[] = nftData.attributes.map((attr) => ({
      nft_id: nft.id,
      trait_type: attr.trait_type,
      value: attr.value,
    }));

    const { error: attrError } = await supabase
      .from('nft_attributes')
      .insert(attributeInserts);

    if (attrError) {
      console.error('Error saving NFT attributes:', attrError);
      // Don't throw - NFT is saved, attributes are optional
    }
  }

  return nft;
}

/**
 * Get all NFTs for a wallet address
 */
export async function getUserNFTs(walletAddress: string): Promise<NFTWithAttributes[]> {
  const normalizedAddress = walletAddress.toLowerCase();

  // Get NFTs
  const { data: nfts, error: nftsError } = await supabase
    .from('nfts')
    .select('*')
    .eq('owner_wallet', normalizedAddress)
    .order('minted_at', { ascending: false });

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
    // Return NFTs without attributes
    return nfts.map((nft) => ({ ...nft, attributes: [] }));
  }

  // Combine NFTs with their attributes
  const nftsWithAttributes: NFTWithAttributes[] = nfts.map((nft) => ({
    ...nft,
    attributes: attributes?.filter((attr) => attr.nft_id === nft.id) || [],
  }));

  return nftsWithAttributes;
}

/**
 * Get single NFT by token ID
 */
export async function getNFTByTokenId(
  tokenId: string,
  contractAddress: string,
  chainId: number = 11155111
): Promise<NFTWithAttributes | null> {
  const { data: nft, error: nftError } = await supabase
    .from('nfts')
    .select('*')
    .eq('token_id', tokenId)
    .eq('contract_address', contractAddress.toLowerCase())
    .eq('chain_id', chainId)
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
}

/**
 * Get NFT by transaction hash
 */
export async function getNFTByTxHash(txHash: string): Promise<NFTWithAttributes | null> {
  const { data: nft, error: nftError } = await supabase
    .from('nfts')
    .select('*')
    .eq('mint_tx_hash', txHash)
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
}

/**
 * Update NFT metadata (for reveals, etc.)
 */
export async function updateNFTMetadata(
  nftId: string,
  updates: {
    name?: string;
    description?: string;
    imageUrl?: string;
    metadataUri?: string;
  }
) {
  const { data, error } = await supabase
    .from('nfts')
    .update({
      name: updates.name,
      description: updates.description,
      image_url: updates.imageUrl,
      metadata_uri: updates.metadataUri,
    })
    .eq('id', nftId)
    .select()
    .single();

  if (error) {
    console.error('Error updating NFT:', error);
    throw new Error(`Failed to update NFT: ${error.message}`);
  }

  return data;
}

/**
 * Get NFT count for a wallet
 */
export async function getNFTCount(walletAddress: string): Promise<number> {
  const { count, error } = await supabase
    .from('nfts')
    .select('*', { count: 'exact', head: true })
    .eq('owner_wallet', walletAddress.toLowerCase());

  if (error) {
    console.error('Error counting NFTs:', error);
    return 0;
  }

  return count || 0;
}
