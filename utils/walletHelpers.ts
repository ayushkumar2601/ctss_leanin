import { BrowserProvider } from 'ethers';

export const detectWalletProvider = () => {
  if (!window.ethereum) {
    return { hasWallet: false, walletType: null };
  }

  if (window.ethereum.isMetaMask) {
    return { hasWallet: true, walletType: 'metamask' as const };
  }

  if (window.ethereum.isPhantom) {
    return { hasWallet: true, walletType: 'phantom' as const };
  }

  return { hasWallet: true, walletType: 'unknown' as const };
};

export const shortenAddress = (address: string, chars = 4): string => {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
};

export const getNetworkName = (chainId: number): string => {
  const networks: Record<number, string> = {
    1: 'Ethereum Mainnet',
    11155111: 'Sepolia Testnet',
    5: 'Goerli Testnet',
    137: 'Polygon',
    80001: 'Mumbai Testnet',
  };
  return networks[chainId] || `Chain ID: ${chainId}`;
};

export const isValidAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

export const formatBalance = (balance: string, decimals = 4): string => {
  const num = parseFloat(balance);
  if (isNaN(num)) return '0';
  return num.toFixed(decimals);
};
