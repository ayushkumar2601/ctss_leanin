import { useState, useEffect } from 'react';
import { formatEther } from 'ethers';
import { useWallet } from '../contexts/WalletContext';

/**
 * Hook to fetch and display wallet ETH balance
 * Updates automatically when wallet changes
 */
export const useWalletBalance = () => {
  const { walletAddress, provider } = useWallet();
  const [balance, setBalance] = useState<string>('0');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!walletAddress || !provider) {
        setBalance('0');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const balanceWei = await provider.getBalance(walletAddress);
        const balanceEth = formatEther(balanceWei);
        setBalance(parseFloat(balanceEth).toFixed(4));
      } catch (err) {
        console.error('Failed to fetch balance:', err);
        setError('Failed to fetch balance');
        setBalance('0');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalance();

    // Refresh balance every 10 seconds
    const interval = setInterval(fetchBalance, 10000);
    return () => clearInterval(interval);
  }, [walletAddress, provider]);

  return { balance, isLoading, error };
};
