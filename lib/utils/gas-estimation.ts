// =====================================================
// GAS ESTIMATION UTILITIES
// Estimate gas costs for transactions
// =====================================================

import { JsonRpcSigner, formatEther, parseEther } from 'ethers';
import { Contract } from 'ethers';

const MARKETPLACE_ADDRESS = import.meta.env.VITE_MARKETPLACE_ADDRESS;
const NFT_CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

const MARKETPLACE_ABI = [
  'function listNFT(address nftContract, uint256 tokenId, uint256 price) external',
  'function buyNFT(address nftContract, uint256 tokenId) external payable',
  'function cancelListing(address nftContract, uint256 tokenId) external',
];

const NFT_ABI = [
  'function approve(address to, uint256 tokenId) external',
];

export interface GasEstimate {
  gasLimit: bigint;
  gasPrice: bigint;
  gasCostWei: bigint;
  gasCostEth: string;
  totalCostEth?: string; // For buy transactions (gas + price)
}

/**
 * Estimate gas for approving marketplace
 */
export async function estimateApprovalGas(
  signer: JsonRpcSigner,
  tokenId: string
): Promise<GasEstimate> {
  try {
    const nftContract = new Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, signer);
    
    const gasLimit = await nftContract.approve.estimateGas(
      MARKETPLACE_ADDRESS,
      tokenId
    );
    
    const feeData = await signer.provider.getFeeData();
    const gasPrice = feeData.gasPrice || 0n;
    const gasCostWei = gasLimit * gasPrice;
    
    return {
      gasLimit,
      gasPrice,
      gasCostWei,
      gasCostEth: formatEther(gasCostWei),
    };
  } catch (error: any) {
    console.error('Error estimating approval gas:', error);
    throw new Error(`Failed to estimate gas: ${error.message}`);
  }
}

/**
 * Estimate gas for listing NFT
 */
export async function estimateListGas(
  signer: JsonRpcSigner,
  tokenId: string,
  priceEth: string
): Promise<GasEstimate> {
  try {
    const marketplace = new Contract(MARKETPLACE_ADDRESS, MARKETPLACE_ABI, signer);
    const priceWei = parseEther(priceEth);
    
    const gasLimit = await marketplace.listNFT.estimateGas(
      NFT_CONTRACT_ADDRESS,
      tokenId,
      priceWei
    );
    
    const feeData = await signer.provider.getFeeData();
    const gasPrice = feeData.gasPrice || 0n;
    const gasCostWei = gasLimit * gasPrice;
    
    return {
      gasLimit,
      gasPrice,
      gasCostWei,
      gasCostEth: formatEther(gasCostWei),
    };
  } catch (error: any) {
    console.error('Error estimating list gas:', error);
    throw new Error(`Failed to estimate gas: ${error.message}`);
  }
}

/**
 * Estimate gas for buying NFT
 */
export async function estimateBuyGas(
  signer: JsonRpcSigner,
  tokenId: string,
  priceEth: string
): Promise<GasEstimate> {
  try {
    const marketplace = new Contract(MARKETPLACE_ADDRESS, MARKETPLACE_ABI, signer);
    const priceWei = parseEther(priceEth);
    
    const gasLimit = await marketplace.buyNFT.estimateGas(
      NFT_CONTRACT_ADDRESS,
      tokenId,
      { value: priceWei }
    );
    
    const feeData = await signer.provider.getFeeData();
    const gasPrice = feeData.gasPrice || 0n;
    const gasCostWei = gasLimit * gasPrice;
    const gasCostEth = formatEther(gasCostWei);
    
    const totalCostWei = gasCostWei + priceWei;
    const totalCostEth = formatEther(totalCostWei);
    
    return {
      gasLimit,
      gasPrice,
      gasCostWei,
      gasCostEth,
      totalCostEth,
    };
  } catch (error: any) {
    console.error('Error estimating buy gas:', error);
    throw new Error(`Failed to estimate gas: ${error.message}`);
  }
}

/**
 * Estimate gas for cancelling listing
 */
export async function estimateCancelGas(
  signer: JsonRpcSigner,
  tokenId: string
): Promise<GasEstimate> {
  try {
    const marketplace = new Contract(MARKETPLACE_ADDRESS, MARKETPLACE_ABI, signer);
    
    const gasLimit = await marketplace.cancelListing.estimateGas(
      NFT_CONTRACT_ADDRESS,
      tokenId
    );
    
    const feeData = await signer.provider.getFeeData();
    const gasPrice = feeData.gasPrice || 0n;
    const gasCostWei = gasLimit * gasPrice;
    
    return {
      gasLimit,
      gasPrice,
      gasCostWei,
      gasCostEth: formatEther(gasCostWei),
    };
  } catch (error: any) {
    console.error('Error estimating cancel gas:', error);
    throw new Error(`Failed to estimate gas: ${error.message}`);
  }
}

/**
 * Format gas estimate for display
 */
export function formatGasEstimate(estimate: GasEstimate): string {
  return `~${parseFloat(estimate.gasCostEth).toFixed(6)} ETH`;
}
