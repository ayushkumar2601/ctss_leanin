/**
 * Explorer utilities for generating blockchain explorer URLs
 */

export type ExplorerType = 'transaction' | 'contract' | 'token' | 'address';

interface ExplorerConfig {
  chainId: number;
  baseUrl: string;
}

// Supported explorers by chain ID
const EXPLORERS: Record<number, ExplorerConfig> = {
  11155111: {
    chainId: 11155111,
    baseUrl: 'https://sepolia.etherscan.io',
  },
  // Add more networks as needed
  1: {
    chainId: 1,
    baseUrl: 'https://etherscan.io',
  },
};

/**
 * Get explorer URL for a specific type and value
 * @param type - Type of explorer link (transaction, contract, token, address)
 * @param value - The value to link to (tx hash, contract address, etc.)
 * @param chainId - Chain ID (defaults to Sepolia)
 * @returns Full explorer URL or null if not supported
 */
export function getExplorerUrl(
  type: ExplorerType,
  value: string,
  chainId: number = 11155111
): string | null {
  const explorer = EXPLORERS[chainId];
  
  if (!explorer || !value) {
    return null;
  }

  switch (type) {
    case 'transaction':
      return `${explorer.baseUrl}/tx/${value}`;
    case 'contract':
      return `${explorer.baseUrl}/address/${value}`;
    case 'token':
      return `${explorer.baseUrl}/token/${value}`;
    case 'address':
      return `${explorer.baseUrl}/address/${value}`;
    default:
      return null;
  }
}

/**
 * Get explorer name for a chain ID
 * @param chainId - Chain ID
 * @returns Explorer name (e.g., "Etherscan", "Sepolia Etherscan")
 */
export function getExplorerName(chainId: number): string {
  switch (chainId) {
    case 11155111:
      return 'Sepolia Etherscan';
    case 1:
      return 'Etherscan';
    default:
      return 'Block Explorer';
  }
}

/**
 * Check if chain is supported for explorer links
 * @param chainId - Chain ID
 * @returns true if supported
 */
export function isChainSupported(chainId: number): boolean {
  return chainId in EXPLORERS;
}

/**
 * Check if chain is Sepolia
 * @param chainId - Chain ID
 * @returns true if Sepolia
 */
export function isSepolia(chainId: number): boolean {
  return chainId === 11155111;
}
