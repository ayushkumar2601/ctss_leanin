// =====================================================
// MINTING SERVICE
// Orchestrates IPFS upload, contract minting, and DB save
// =====================================================

import { JsonRpcSigner } from 'ethers';
import { uploadImageToIPFS, uploadMetadataToIPFS, getIPFSUri, getIPFSGatewayUrl } from '../ipfs/pinata';
import { mintNFT as mintNFTContract } from '../contracts/nft-contract';
import { saveMintedNFT } from '../supabase/nft-service';

export interface MintNFTParams {
  file: File;
  name: string;
  description: string;
  location?: string;
  urgency?: 'Low' | 'Medium' | 'High';
  aiConfidence?: number;
  aiAssessment?: string;
  attributes?: Array<{
    trait_type: string;
    value: string;
  }>;
}

export interface MintProgress {
  step: 'uploading-image' | 'uploading-metadata' | 'minting' | 'saving' | 'complete';
  message: string;
  progress: number; // 0-100
}

export type ProgressCallback = (progress: MintProgress) => void;

export interface MintSuccess {
  tokenId: string;
  transactionHash: string;
  metadataUri: string;
  imageUrl: string;
  contractAddress: string;
}

/**
 * Complete NFT minting flow
 * @param signer Wallet signer
 * @param params Mint parameters
 * @param onProgress Progress callback
 * @returns Mint success details
 */
export async function mintNFT(
  signer: JsonRpcSigner,
  params: MintNFTParams,
  onProgress?: ProgressCallback
): Promise<MintSuccess> {
  const { file, name, description, location, urgency, aiConfidence, aiAssessment, attributes } = params;

  // Validate inputs
  if (!file) {
    throw new Error('Image file is required');
  }

  if (!name || name.trim().length === 0) {
    throw new Error('NFT name is required');
  }

  if (!signer) {
    throw new Error('Wallet not connected');
  }

  try {
    // Step 1: Upload image to IPFS
    onProgress?.({
      step: 'uploading-image',
      message: 'Uploading image to IPFS...',
      progress: 10,
    });

    const imageHash = await uploadImageToIPFS(file);
    const imageUri = getIPFSUri(imageHash);
    // Use ipfs.io gateway for better CORS support
    const imageUrl = `https://ipfs.io/ipfs/${imageHash}`;

    console.log('✅ Image uploaded:', imageUri);

    // Step 2: Create and upload metadata to IPFS
    onProgress?.({
      step: 'uploading-metadata',
      message: 'Uploading metadata to IPFS...',
      progress: 30,
    });

    const metadata = {
      name,
      description: description || '',
      image: imageUri,
      attributes: attributes || [],
    };

    const metadataHash = await uploadMetadataToIPFS(metadata);
    const metadataUri = getIPFSUri(metadataHash);

    console.log('✅ Metadata uploaded:', metadataUri);

    // Step 3: Mint NFT on blockchain
    onProgress?.({
      step: 'minting',
      message: 'Minting NFT on blockchain...',
      progress: 50,
    });

    const walletAddress = await signer.getAddress();
    const mintResult = await mintNFTContract(signer, walletAddress, metadataUri);

    console.log('✅ NFT minted:', mintResult);

    // Step 4: Save to Supabase
    onProgress?.({
      step: 'saving',
      message: 'Saving to database...',
      progress: 80,
    });

    await saveMintedNFT({
      tokenId: mintResult.tokenId,
      contractAddress: mintResult.contractAddress,
      chainId: 11155111, // Sepolia
      ownerWallet: walletAddress,
      name,
      description: description || null,
      location: location || null,
      urgency: urgency || 'Medium',
      aiConfidence: aiConfidence || null,
      aiAssessment: aiAssessment || null,
      imageUrl: imageUrl, // Store gateway URL for compatibility
      metadataUri,
      mintTxHash: mintResult.transactionHash,
      mintedAt: new Date(),
      attributes,
    });

    console.log('✅ Saved to database');

    // Step 5: Complete
    onProgress?.({
      step: 'complete',
      message: 'NFT minted successfully!',
      progress: 100,
    });

    return {
      tokenId: mintResult.tokenId,
      transactionHash: mintResult.transactionHash,
      metadataUri,
      imageUrl,
      contractAddress: mintResult.contractAddress,
    };
  } catch (error: any) {
    console.error('❌ Minting failed:', error);
    throw error;
  }
}

/**
 * Validate minting prerequisites
 * @param signer Wallet signer
 * @returns Validation result
 */
export async function validateMintingPrerequisites(signer: JsonRpcSigner | null): Promise<{
  valid: boolean;
  error?: string;
}> {
  // Check wallet connection
  if (!signer) {
    return { valid: false, error: 'Wallet not connected' };
  }

  try {
    // Check network
    const network = await signer.provider.getNetwork();
    if (Number(network.chainId) !== 11155111) {
      return { valid: false, error: 'Wrong network. Switch to Sepolia testnet.' };
    }

    // Check balance
    const address = await signer.getAddress();
    const balance = await signer.provider.getBalance(address);

    if (balance === 0n) {
      return { valid: false, error: 'Insufficient ETH for gas fees' };
    }

    return { valid: true };
  } catch (error: any) {
    return { valid: false, error: error.message };
  }
}
