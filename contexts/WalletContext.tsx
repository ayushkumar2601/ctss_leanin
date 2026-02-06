import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BrowserProvider, JsonRpcSigner } from 'ethers';
import { upsertUser } from '../lib/supabase/nft-service';

type WalletType = 'metamask' | 'phantom' | null;

interface WalletContextType {
  walletAddress: string | null;
  walletType: WalletType;
  provider: BrowserProvider | null;
  signer: JsonRpcSigner | null;
  chainId: number | null;
  isConnecting: boolean;
  error: string | null;
  connectMetaMask: () => Promise<void>;
  connectPhantom: () => Promise<void>;
  disconnectWallet: () => void;
  switchToSepolia: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const SEPOLIA_CHAIN_ID = 11155111;
const SEPOLIA_PARAMS = {
  chainId: '0xaa36a7',
  chainName: 'Sepolia Testnet',
  nativeCurrency: { name: 'Sepolia ETH', symbol: 'ETH', decimals: 18 },
  rpcUrls: ['https://sepolia.infura.io/v3/'],
  blockExplorerUrls: ['https://sepolia.etherscan.io']
};

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletType, setWalletType] = useState<WalletType>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = async (type: 'metamask' | 'phantom') => {
    setIsConnecting(true);
    setError(null);

    try {
      let selectedProvider;

      // Detect and select the correct provider
      if (type === 'metamask') {
        if (!window.ethereum || !window.ethereum.isMetaMask) {
          throw new Error('METAMASK_NOT_FOUND');
        }
        selectedProvider = window.ethereum;
      } else if (type === 'phantom') {
        // Phantom's Ethereum provider is at window.phantom.ethereum
        if (!window.phantom?.ethereum) {
          throw new Error('PHANTOM_NOT_FOUND');
        }
        selectedProvider = window.phantom.ethereum;
      } else {
        throw new Error('INVALID_WALLET_TYPE');
      }

      // Verify provider has required methods
      if (!selectedProvider || !selectedProvider.request) {
        throw new Error('INVALID_PROVIDER');
      }

      // Request accounts from the selected provider
      const accounts = await selectedProvider.request({
        method: 'eth_requestAccounts'
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('NO_ACCOUNTS');
      }

      // Create provider and signer with the selected provider
      const ethersProvider = new BrowserProvider(selectedProvider);
      const ethersSigner = await ethersProvider.getSigner();
      const network = await ethersProvider.getNetwork();

      setWalletAddress(accounts[0]);
      setWalletType(type);
      setProvider(ethersProvider);
      setSigner(ethersSigner);
      setChainId(Number(network.chainId));

      // Persist connection
      localStorage.setItem('walletConnected', 'true');
      localStorage.setItem('walletType', type);
      localStorage.setItem('walletAddress', accounts[0]);

      // Upsert user to Supabase
      try {
        await upsertUser(accounts[0], type);
      } catch (err) {
        console.error('Failed to save user to database:', err);
        // Don't throw - wallet connection succeeded
      }

    } catch (err: any) {
      console.error('Wallet connection error:', err);
      
      if (err.message === 'METAMASK_NOT_FOUND') {
        setError('METAMASK NOT INSTALLED. GET IT AT METAMASK.IO');
      } else if (err.message === 'PHANTOM_NOT_FOUND') {
        setError('PHANTOM NOT INSTALLED. GET IT AT PHANTOM.APP');
      } else if (err.message === 'INVALID_PROVIDER') {
        setError('WALLET PROVIDER INVALID. TRY REFRESHING THE PAGE.');
      } else if (err.message === 'NO_ACCOUNTS') {
        setError('NO ACCOUNTS FOUND. UNLOCK YOUR WALLET.');
      } else if (err.code === 4001) {
        setError('CONNECTION REJECTED. VIBE CHECK FAILED.');
      } else if (err.code === -32002) {
        setError('WALLET REQUEST PENDING. CHECK YOUR EXTENSION.');
      } else {
        setError(`CONNECTION FAILED: ${err.message || 'UNKNOWN ERROR'}`);
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const connectMetaMask = () => connectWallet('metamask');
  const connectPhantom = () => connectWallet('phantom');

  const disconnectWallet = () => {
    setWalletAddress(null);
    setWalletType(null);
    setProvider(null);
    setSigner(null);
    setChainId(null);
    setError(null);
    
    // Clear localStorage
    localStorage.removeItem('walletConnected');
    localStorage.removeItem('walletType');
    localStorage.removeItem('walletAddress');
  };

  const switchToSepolia = async () => {
    // Get the correct provider based on wallet type
    let currentProvider;
    if (walletType === 'phantom' && window.phantom?.ethereum) {
      currentProvider = window.phantom.ethereum;
    } else if (walletType === 'metamask' && window.ethereum) {
      currentProvider = window.ethereum;
    } else {
      setError('NO WALLET CONNECTED');
      return;
    }

    try {
      await currentProvider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SEPOLIA_PARAMS.chainId }]
      });
    } catch (err: any) {
      // Chain not added, try adding it
      if (err.code === 4902) {
        try {
          await currentProvider.request({
            method: 'wallet_addEthereumChain',
            params: [SEPOLIA_PARAMS]
          });
        } catch (addError) {
          console.error('Failed to add Sepolia:', addError);
          setError('FAILED TO ADD SEPOLIA NETWORK. DO IT MANUALLY.');
        }
      } else {
        console.error('Failed to switch network:', err);
        setError('NETWORK SWITCH FAILED. TRY MANUALLY.');
      }
    }
  };

  // Auto-reconnect on mount (disabled by default - uncomment to enable)
  useEffect(() => {
    // Uncomment below to enable auto-reconnect
    /*
    const wasConnected = localStorage.getItem('walletConnected');
    const savedType = localStorage.getItem('walletType') as WalletType;

    if (wasConnected && savedType && window.ethereum) {
      if (savedType === 'metamask') {
        connectMetaMask();
      } else if (savedType === 'phantom') {
        connectPhantom();
      }
    }
    */
  }, []);

  // Listen for account changes
  useEffect(() => {
    // Get the correct provider based on wallet type
    let currentProvider;
    if (walletType === 'phantom' && window.phantom?.ethereum) {
      currentProvider = window.phantom.ethereum;
    } else if (walletType === 'metamask' && window.ethereum) {
      currentProvider = window.ethereum;
    }

    if (!currentProvider) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        setWalletAddress(accounts[0]);
        localStorage.setItem('walletAddress', accounts[0]);
      }
    };

    const handleChainChanged = (chainIdHex: string) => {
      const newChainId = parseInt(chainIdHex, 16);
      setChainId(newChainId);
      // Reload to reset state
      window.location.reload();
    };

    currentProvider.on('accountsChanged', handleAccountsChanged);
    currentProvider.on('chainChanged', handleChainChanged);

    return () => {
      if (currentProvider.removeListener) {
        currentProvider.removeListener('accountsChanged', handleAccountsChanged);
        currentProvider.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [walletType]);

  return (
    <WalletContext.Provider
      value={{
        walletAddress,
        walletType,
        provider,
        signer,
        chainId,
        isConnecting,
        error,
        connectMetaMask,
        connectPhantom,
        disconnectWallet,
        switchToSepolia
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
};

export { SEPOLIA_CHAIN_ID };
