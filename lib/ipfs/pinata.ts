// =====================================================
// PINATA IPFS UPLOAD SERVICE
// Production-ready IPFS pinning with error handling
// =====================================================

const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
const PINATA_SECRET = import.meta.env.VITE_PINATA_SECRET;
const PINATA_API_URL = 'https://api.pinata.cloud';

interface PinataResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes?: Array<{
    trait_type: string;
    value: string;
  }>;
}

/**
 * Validate Pinata credentials
 */
function validateCredentials(): void {
  if (!PINATA_API_KEY || !PINATA_SECRET) {
    throw new Error(
      'Missing Pinata credentials. Set VITE_PINATA_API_KEY and VITE_PINATA_SECRET in .env.local'
    );
  }
}

/**
 * Upload image file to IPFS via Pinata
 * @param file Image file to upload
 * @returns IPFS hash (CID)
 */
export async function uploadImageToIPFS(file: File): Promise<string> {
  validateCredentials();

  // Validate file
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image');
  }

  const maxSize = 100 * 1024 * 1024; // 100MB
  if (file.size > maxSize) {
    throw new Error('File size must be less than 100MB');
  }

  try {
    const formData = new FormData();
    formData.append('file', file);

    // Add metadata
    const metadata = JSON.stringify({
      name: file.name,
      keyvalues: {
        type: 'nft-image',
        uploadedAt: new Date().toISOString(),
      },
    });
    formData.append('pinataMetadata', metadata);

    const response = await fetch(`${PINATA_API_URL}/pinning/pinFileToIPFS`, {
      method: 'POST',
      headers: {
        pinata_api_key: PINATA_API_KEY!,
        pinata_secret_api_key: PINATA_SECRET!,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Pinata upload failed: ${error.error || response.statusText}`);
    }

    const data: PinataResponse = await response.json();
    console.log('✅ Image uploaded to IPFS:', data.IpfsHash);

    return data.IpfsHash;
  } catch (error: any) {
    console.error('❌ IPFS image upload failed:', error);
    throw new Error(`Failed to upload image to IPFS: ${error.message}`);
  }
}

/**
 * Upload metadata JSON to IPFS via Pinata
 * @param metadata NFT metadata object
 * @returns IPFS hash (CID)
 */
export async function uploadMetadataToIPFS(metadata: NFTMetadata): Promise<string> {
  validateCredentials();

  // Validate metadata
  if (!metadata.name || !metadata.image) {
    throw new Error('Metadata must include name and image');
  }

  try {
    const response = await fetch(`${PINATA_API_URL}/pinning/pinJSONToIPFS`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        pinata_api_key: PINATA_API_KEY!,
        pinata_secret_api_key: PINATA_SECRET!,
      },
      body: JSON.stringify({
        pinataContent: metadata,
        pinataMetadata: {
          name: `${metadata.name}-metadata`,
          keyvalues: {
            type: 'nft-metadata',
            uploadedAt: new Date().toISOString(),
          },
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Pinata upload failed: ${error.error || response.statusText}`);
    }

    const data: PinataResponse = await response.json();
    console.log('✅ Metadata uploaded to IPFS:', data.IpfsHash);

    return data.IpfsHash;
  } catch (error: any) {
    console.error('❌ IPFS metadata upload failed:', error);
    throw new Error(`Failed to upload metadata to IPFS: ${error.message}`);
  }
}

/**
 * Convert IPFS hash to full URI
 * @param hash IPFS hash (CID)
 * @returns ipfs:// URI
 */
export function getIPFSUri(hash: string): string {
  return `ipfs://${hash}`;
}

/**
 * Convert IPFS URI to HTTP gateway URL
 * @param uri IPFS URI (ipfs://...) or already a gateway URL
 * @returns HTTP gateway URL
 */
export function getIPFSGatewayUrl(uri: string): string {
  if (!uri) return '';
  
  // If already an HTTP URL, return as-is
  if (uri.startsWith('http://') || uri.startsWith('https://')) {
    return uri;
  }
  
  // Use ipfs.io as default gateway (better CORS support than Pinata public gateway)
  const gateway = import.meta.env.VITE_IPFS_GATEWAY || 'https://ipfs.io/ipfs/';
  const hash = uri.replace('ipfs://', '');
  
  // Ensure gateway ends with /
  const normalizedGateway = gateway.endsWith('/') ? gateway : `${gateway}/`;
  
  return `${normalizedGateway}${hash}`;
}

/**
 * Test Pinata connection
 * @returns true if credentials are valid
 */
export async function testPinataConnection(): Promise<boolean> {
  validateCredentials();

  try {
    const response = await fetch(`${PINATA_API_URL}/data/testAuthentication`, {
      method: 'GET',
      headers: {
        pinata_api_key: PINATA_API_KEY!,
        pinata_secret_api_key: PINATA_SECRET!,
      },
    });

    return response.ok;
  } catch (error) {
    console.error('❌ Pinata connection test failed:', error);
    return false;
  }
}
