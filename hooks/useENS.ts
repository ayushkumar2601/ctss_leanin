import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// Session cache for ENS lookups
const ensCache = new Map<string, string | null>();

/**
 * Hook for resolving ENS names from wallet addresses
 * @param address - Ethereum wallet address
 * @returns ENS name or null if not found
 */
export function useENS(address: string | null): string | null {
  const [ensName, setEnsName] = useState<string | null>(null);

  useEffect(() => {
    if (!address) {
      setEnsName(null);
      return;
    }

    // Check cache first
    if (ensCache.has(address)) {
      setEnsName(ensCache.get(address) || null);
      return;
    }

    // Resolve ENS name
    const resolveENS = async () => {
      try {
        // Use Infura provider for ENS lookup (mainnet only)
        const provider = new ethers.JsonRpcProvider(
          'https://mainnet.infura.io/v3/e5f8c8fa45104cf49b75dc91daa00199'
        );
        
        const name = await provider.lookupAddress(address);
        
        // Cache the result
        ensCache.set(address, name);
        setEnsName(name);
      } catch (error) {
        // ENS lookup failed or not found - cache null result
        ensCache.set(address, null);
        setEnsName(null);
      }
    };

    resolveENS();
  }, [address]);

  return ensName;
}
