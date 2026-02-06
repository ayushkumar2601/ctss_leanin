// =====================================================
// NFT CONTRACT INTERACTION
// Production-ready contract calls with error handling
// =====================================================

import { Contract, BrowserProvider, JsonRpcSigner } from 'ethers';

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
const SEPOLIA_CHAIN_ID = 11155111;

// Contract ABI - only the functions we need
const NFT_ABI = [
  'function mintNFT(address to, string memory uri) public returns (uint256)',
  'function tokenURI(uint256 tokenId) public view returns (string memory)',
  'function ownerOf(uint256 tokenId) public view returns (address)',
  'function totalSupply() public view returns (uint256)',
  'function getCurrentTokenId() public view returns (uint256)',
  'event Minted(address indexed owner, uint256 indexed tokenId, string tokenURI, uint256 timestamp)',
];

export interface MintResult {
  tokenId: string;
  transactionHash: string;
  blockNumber: number;
  gasUsed: string;
  contractAddress: string;
}

/**
 * Validate contract configuration
 */
function validateConfig(): void {
  if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000') {
    throw new Error(
      'Contract not deployed. Set VITE_CONTRACT_ADDRESS in .env.local after deploying the contract.'
    );
  }
}

/**
 * Get NFT contract instance
 * @param signerOrProvider Signer for write operations, Provider for read operations
 * @returns Contract instance
 */
export function getNFTContract(signerOrProvider: JsonRpcSigner | BrowserProvider): Contract {
  validateConfig();
  return new Contract(CONTRACT_ADDRESS!, NFT_ABI, signerOrProvider);
}

/**
 * Mint a new NFT
 * @param signer Wallet signer
 * @param toAddress Address to mint NFT to
 * @param metadataUri IPFS metadata URI (ipfs://...)
 * @returns Mint result with token ID and transaction details
 */
export async function mintNFT(
  signer: JsonRpcSigner,
  toAddress: string,
  metadataUri: string
): Promise<MintResult> {
  validateConfig();

  // Validate inputs
  if (!toAddress || toAddress === '0x0000000000000000000000000000000000000000') {
    throw new Error('Invalid recipient address');
  }

  if (!metadataUri || !metadataUri.startsWith('ipfs://')) {
    throw new Error('Invalid metadata URI. Must start with ipfs://');
  }

  // Validate network
  const network = await signer.provider.getNetwork();
  if (Number(network.chainId) !== SEPOLIA_CHAIN_ID) {
    throw new Error('Wrong network. Please switch to Sepolia testnet.');
  }

  try {
    console.log('🎨 Minting NFT...');
    console.log('📍 Contract:', CONTRACT_ADDRESS);
    console.log('👤 To:', toAddress);
    console.log('📄 Metadata URI:', metadataUri);

    const contract = getNFTContract(signer);

    // Estimate gas
    const gasEstimate = await contract.mintNFT.estimateGas(toAddress, metadataUri);
    console.log('⛽ Estimated gas:', gasEstimate.toString());

    // Send transaction
    const tx = await contract.mintNFT(toAddress, metadataUri, {
      gasLimit: gasEstimate * 120n / 100n, // Add 20% buffer
    });

    console.log('⏳ Transaction sent:', tx.hash);
    console.log('⏳ Waiting for confirmation...');

    // Wait for confirmation
    const receipt = await tx.wait();

    if (!receipt || receipt.status !== 1) {
      throw new Error('Transaction failed');
    }

    console.log('✅ Transaction confirmed!');
    console.log('📦 Block:', receipt.blockNumber);

    // Extract token ID from Minted event
    const mintedEvent = receipt.logs
      .map((log: any) => {
        try {
          return contract.interface.parseLog(log);
        } catch {
          return null;
        }
      })
      .find((event: any) => event && event.name === 'Minted');

    if (!mintedEvent) {
      throw new Error('Minted event not found in transaction logs');
    }

    const tokenId = mintedEvent.args.tokenId.toString();
    console.log('🎫 Token ID:', tokenId);

    return {
      tokenId,
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
      contractAddress: CONTRACT_ADDRESS!,
    };
  } catch (error: any) {
    console.error('❌ Minting failed:', error);

    // Handle specific errors
    if (error.code === 'ACTION_REJECTED') {
      throw new Error('Transaction rejected by user');
    }

    if (error.code === 'INSUFFICIENT_FUNDS') {
      throw new Error('Insufficient funds for gas');
    }

    if (error.message?.includes('execution reverted')) {
      throw new Error('Contract execution failed. Check contract state.');
    }

    throw new Error(`Minting failed: ${error.message || 'Unknown error'}`);
  }
}

/**
 * Get token URI for a specific token ID
 * @param provider Blockchain provider
 * @param tokenId Token ID
 * @returns Token URI (ipfs://...)
 */
export async function getTokenURI(provider: BrowserProvider, tokenId: string): Promise<string> {
  validateConfig();

  try {
    const contract = getNFTContract(provider);
    const uri = await contract.tokenURI(tokenId);
    return uri;
  } catch (error: any) {
    console.error('❌ Failed to get token URI:', error);
    throw new Error(`Failed to get token URI: ${error.message}`);
  }
}

/**
 * Get owner of a specific token
 * @param provider Blockchain provider
 * @param tokenId Token ID
 * @returns Owner address
 */
export async function getTokenOwner(provider: BrowserProvider, tokenId: string): Promise<string> {
  validateConfig();

  try {
    const contract = getNFTContract(provider);
    const owner = await contract.ownerOf(tokenId);
    return owner;
  } catch (error: any) {
    console.error('❌ Failed to get token owner:', error);
    throw new Error(`Failed to get token owner: ${error.message}`);
  }
}

/**
 * Get total supply of minted NFTs
 * @param provider Blockchain provider
 * @returns Total supply
 */
export async function getTotalSupply(provider: BrowserProvider): Promise<number> {
  validateConfig();

  try {
    const contract = getNFTContract(provider);
    const supply = await contract.totalSupply();
    return Number(supply);
  } catch (error: any) {
    console.error('❌ Failed to get total supply:', error);
    return 0;
  }
}
