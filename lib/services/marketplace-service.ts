// =====================================================
// MARKETPLACE SERVICE
// High-level marketplace operations
// =====================================================

import { JsonRpcSigner } from 'ethers';
import {
  isMarketplaceApproved,
  approveMarketplace,
  listNFT as listNFTContract,
  buyNFT as buyNFTContract,
  cancelListing as cancelListingContract,
} from '../contracts/marketplace-contract';
import { supabase } from '../supabase/client';
import type { ListingInsert, SaleInsert, PriceHistoryInsert, ActivityFeedInsert } from '../supabase/types';

/**
 * List NFT for sale
 */
export async function createListing(
  signer: JsonRpcSigner,
  nftId: string,
  tokenId: string,
  priceEth: string
): Promise<void> {
  const walletAddress = await signer.getAddress();
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

  // Check if marketplace is approved
  const isApproved = await isMarketplaceApproved(signer, tokenId);
  
  if (!isApproved) {
    console.log('🔓 Approving marketplace...');
    await approveMarketplace(signer, tokenId);
  }

  // List on contract
  const { transactionHash } = await listNFTContract(signer, tokenId, priceEth);

  // Save to database
  const listing: ListingInsert = {
    nft_id: nftId,
    token_id: tokenId,
    contract_address: contractAddress,
    seller_wallet: walletAddress.toLowerCase(),
    price_eth: priceEth,
    status: 'active',
    tx_hash: transactionHash,
  };

  const { error: listingError } = await supabase
    .from('listings')
    .insert(listing);

  if (listingError) {
    console.error('Error saving listing:', listingError);
    throw new Error(`Failed to save listing: ${listingError.message}`);
  }

  // Record price history
  const priceHistory: PriceHistoryInsert = {
    nft_id: nftId,
    price_eth: priceEth,
    event: 'listed',
    from_wallet: walletAddress.toLowerCase(),
    tx_hash: transactionHash,
  };

  await supabase.from('price_history').insert(priceHistory);

  // Record activity
  const activity: ActivityFeedInsert = {
    nft_id: nftId,
    activity_type: 'listed',
    from_wallet: walletAddress.toLowerCase(),
    price_eth: priceEth,
    tx_hash: transactionHash,
  };

  await supabase.from('activity_feed').insert(activity);

  console.log('✅ Listing created successfully');
}

/**
 * Buy NFT
 */
export async function purchaseNFT(
  signer: JsonRpcSigner,
  nftId: string,
  tokenId: string,
  listingId: string,
  priceEth: string,
  sellerWallet: string
): Promise<void> {
  const buyerWallet = await signer.getAddress();

  // Buy on contract
  const { transactionHash } = await buyNFTContract(signer, tokenId, priceEth);

  // Update listing status
  const { error: listingError } = await supabase
    .from('listings')
    .update({ status: 'sold' })
    .eq('id', listingId);

  if (listingError) {
    console.error('Error updating listing:', listingError);
  }

  // Update NFT owner
  const { error: nftError } = await supabase
    .from('nfts')
    .update({ owner_wallet: buyerWallet.toLowerCase() })
    .eq('id', nftId);

  if (nftError) {
    console.error('Error updating NFT owner:', nftError);
  }

  // Record sale
  const platformFee = (parseFloat(priceEth) * 2.5) / 100;
  const sale: SaleInsert = {
    nft_id: nftId,
    listing_id: listingId,
    buyer_wallet: buyerWallet.toLowerCase(),
    seller_wallet: sellerWallet.toLowerCase(),
    price_eth: priceEth,
    platform_fee_eth: platformFee.toFixed(8),
    tx_hash: transactionHash,
    sold_at: new Date().toISOString(),
  };

  await supabase.from('sales').insert(sale);

  // Record price history
  const priceHistory: PriceHistoryInsert = {
    nft_id: nftId,
    price_eth: priceEth,
    event: 'sold',
    from_wallet: sellerWallet.toLowerCase(),
    to_wallet: buyerWallet.toLowerCase(),
    tx_hash: transactionHash,
  };

  await supabase.from('price_history').insert(priceHistory);

  // Record activity
  const activity: ActivityFeedInsert = {
    nft_id: nftId,
    activity_type: 'sold',
    from_wallet: sellerWallet.toLowerCase(),
    to_wallet: buyerWallet.toLowerCase(),
    price_eth: priceEth,
    tx_hash: transactionHash,
  };

  await supabase.from('activity_feed').insert(activity);

  console.log('✅ Purchase completed successfully');
}

/**
 * Cancel listing
 */
export async function cancelListingService(
  signer: JsonRpcSigner,
  nftId: string,
  tokenId: string,
  listingId: string
): Promise<void> {
  const walletAddress = await signer.getAddress();

  // Cancel on contract
  const transactionHash = await cancelListingContract(signer, tokenId);

  // Update listing status
  const { error } = await supabase
    .from('listings')
    .update({ status: 'cancelled' })
    .eq('id', listingId);

  if (error) {
    console.error('Error updating listing:', error);
    throw new Error(`Failed to update listing: ${error.message}`);
  }

  // Record activity
  const activity: ActivityFeedInsert = {
    nft_id: nftId,
    activity_type: 'delisted',
    from_wallet: walletAddress.toLowerCase(),
    tx_hash: transactionHash,
  };

  await supabase.from('activity_feed').insert(activity);

  console.log('✅ Listing cancelled successfully');
}

/**
 * Get active listing for NFT
 */
export async function getActiveListing(nftId: string) {
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('nft_id', nftId)
    .eq('status', 'active')
    .maybeSingle();

  if (error) {
    console.error('Error fetching listing:', error);
    return null;
  }

  return data;
}
