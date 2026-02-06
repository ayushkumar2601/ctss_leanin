// =====================================================
// MARKETPLACE CONTRACT INTEGRATION
// Interact with NFTMarketplace smart contract
// =====================================================

import { Contract, JsonRpcSigner, parseEther, formatEther } from 'ethers';

const MARKETPLACE_ADDRESS = import.meta.env.VITE_MARKETPLACE_ADDRESS;
const NFT_CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

// Marketplace ABI (only functions we need)
const MARKETPLACE_ABI = [
  'function listNFT(address nftContract, uint256 tokenId, uint256 price) external',
  'function buyNFT(address nftContract, uint256 tokenId) external payable',
  'function cancelListing(address nftContract, uint256 tokenId) external',
  'function getListing(address nftContract, uint256 tokenId) external view returns (tuple(address seller, address nftContract, uint256 tokenId, uint256 price, bool active))',
  'function platformFee() external view returns (uint256)',
  'event NFTListed(address indexed seller, address indexed nftContract, uint256 indexed tokenId, uint256 price)',
  'event NFTSold(address indexed buyer, address indexed seller, address indexed nftContract, uint256 tokenId, uint256 price)',
  'event NFTDelisted(address indexed seller, address indexed nftContract, uint256 indexed tokenId)',
];

// NFT Contract ABI (for approval)
const NFT_ABI = [
  'function approve(address to, uint256 tokenId) external',
  'function getApproved(uint256 tokenId) external view returns (address)',
  'function setApprovalForAll(address operator, bool approved) external',
  'function isApprovedForAll(address owner, address operator) external view returns (bool)',
];

/**
 * Get marketplace contract instance
 */
function getMarketplaceContract(signer: JsonRpcSigner): Contract {
  if (!MARKETPLACE_ADDRESS) {
    throw new Error('Marketplace address not configured');
  }
  return new Contract(MARKETPLACE_ADDRESS, MARKETPLACE_ABI, signer);
}

/**
 * Get NFT contract instance
 */
function getNFTContract(signer: JsonRpcSigner): Contract {
  if (!NFT_CONTRACT_ADDRESS) {
    throw new Error('NFT contract address not configured');
  }
  return new Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, signer);
}

/**
 * Check if marketplace is approved for NFT
 */
export async function isMarketplaceApproved(
  signer: JsonRpcSigner,
  tokenId: string
): Promise<boolean> {
  try {
    const nftContract = getNFTContract(signer);
    const walletAddress = await signer.getAddress();
    
    // Check specific token approval
    const approved = await nftContract.getApproved(tokenId);
    if (approved.toLowerCase() === MARKETPLACE_ADDRESS?.toLowerCase()) {
      return true;
    }
    
    // Check operator approval
    const isApprovedForAll = await nftContract.isApprovedForAll(
      walletAddress,
      MARKETPLACE_ADDRESS
    );
    
    return isApprovedForAll;
  } catch (error: any) {
    console.error('Error checking approval:', error);
    return false;
  }
}

/**
 * Approve marketplace to transfer NFT
 */
export async function approveMarketplace(
  signer: JsonRpcSigner,
  tokenId: string
): Promise<string> {
  try {
    const nftContract = getNFTContract(signer);
    
    console.log('🔓 Approving marketplace for token:', tokenId);
    
    const tx = await nftContract.approve(MARKETPLACE_ADDRESS, tokenId);
    console.log('⏳ Approval transaction sent:', tx.hash);
    
    const receipt = await tx.wait();
    console.log('✅ Marketplace approved!');
    
    return receipt.hash;
  } catch (error: any) {
    console.error('❌ Approval failed:', error);
    throw new Error(`Failed to approve marketplace: ${error.message}`);
  }
}

/**
 * List NFT for sale
 */
export async function listNFT(
  signer: JsonRpcSigner,
  tokenId: string,
  priceEth: string
): Promise<{ transactionHash: string; price: string }> {
  try {
    const marketplace = getMarketplaceContract(signer);
    const priceWei = parseEther(priceEth);
    
    console.log('📝 Listing NFT:', {
      tokenId,
      price: priceEth,
      marketplace: MARKETPLACE_ADDRESS,
      nftContract: NFT_CONTRACT_ADDRESS,
    });
    
    const tx = await marketplace.listNFT(
      NFT_CONTRACT_ADDRESS,
      tokenId,
      priceWei
    );
    
    console.log('⏳ Listing transaction sent:', tx.hash);
    
    const receipt = await tx.wait();
    console.log('✅ NFT listed successfully!');
    
    return {
      transactionHash: receipt.hash,
      price: priceEth,
    };
  } catch (error: any) {
    console.error('❌ Listing failed:', error);
    throw new Error(`Failed to list NFT: ${error.message}`);
  }
}

/**
 * Buy listed NFT
 */
export async function buyNFT(
  signer: JsonRpcSigner,
  tokenId: string,
  priceEth: string
): Promise<{ transactionHash: string; price: string }> {
  try {
    const marketplace = getMarketplaceContract(signer);
    const priceWei = parseEther(priceEth);
    
    console.log('💰 Buying NFT:', {
      tokenId,
      price: priceEth,
      marketplace: MARKETPLACE_ADDRESS,
      nftContract: NFT_CONTRACT_ADDRESS,
    });
    
    const tx = await marketplace.buyNFT(
      NFT_CONTRACT_ADDRESS,
      tokenId,
      { value: priceWei }
    );
    
    console.log('⏳ Purchase transaction sent:', tx.hash);
    
    const receipt = await tx.wait();
    console.log('✅ NFT purchased successfully!');
    
    return {
      transactionHash: receipt.hash,
      price: priceEth,
    };
  } catch (error: any) {
    console.error('❌ Purchase failed:', error);
    throw new Error(`Failed to buy NFT: ${error.message}`);
  }
}

/**
 * Cancel NFT listing
 */
export async function cancelListing(
  signer: JsonRpcSigner,
  tokenId: string
): Promise<string> {
  try {
    const marketplace = getMarketplaceContract(signer);
    
    console.log('❌ Cancelling listing for token:', tokenId);
    
    const tx = await marketplace.cancelListing(
      NFT_CONTRACT_ADDRESS,
      tokenId
    );
    
    console.log('⏳ Cancel transaction sent:', tx.hash);
    
    const receipt = await tx.wait();
    console.log('✅ Listing cancelled!');
    
    return receipt.hash;
  } catch (error: any) {
    console.error('❌ Cancel failed:', error);
    throw new Error(`Failed to cancel listing: ${error.message}`);
  }
}

/**
 * Get listing details from contract
 */
export async function getListingFromContract(
  signer: JsonRpcSigner,
  tokenId: string
): Promise<{
  seller: string;
  price: string;
  active: boolean;
} | null> {
  try {
    const marketplace = getMarketplaceContract(signer);
    
    const listing = await marketplace.getListing(
      NFT_CONTRACT_ADDRESS,
      tokenId
    );
    
    if (!listing.active) {
      return null;
    }
    
    return {
      seller: listing.seller,
      price: formatEther(listing.price),
      active: listing.active,
    };
  } catch (error: any) {
    console.error('Error getting listing:', error);
    return null;
  }
}

/**
 * Get platform fee percentage
 */
export async function getPlatformFee(signer: JsonRpcSigner): Promise<number> {
  try {
    const marketplace = getMarketplaceContract(signer);
    const fee = await marketplace.platformFee();
    return Number(fee) / 100; // Convert basis points to percentage
  } catch (error: any) {
    console.error('Error getting platform fee:', error);
    return 2.5; // Default 2.5%
  }
}

/**
 * Calculate platform fee for a price
 */
export function calculatePlatformFee(priceEth: string, feePercent: number): string {
  const price = parseFloat(priceEth);
  const fee = (price * feePercent) / 100;
  return fee.toFixed(8);
}

/**
 * Calculate seller proceeds after fee
 */
export function calculateSellerProceeds(priceEth: string, feePercent: number): string {
  const price = parseFloat(priceEth);
  const fee = (price * feePercent) / 100;
  const proceeds = price - fee;
  return proceeds.toFixed(8);
}
