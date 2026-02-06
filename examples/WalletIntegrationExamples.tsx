/**
 * WALLET INTEGRATION EXAMPLES
 * Copy these patterns into your components
 */

import React from 'react';
import { useWallet } from '../contexts/WalletContext';
import { useWalletBalance } from '../hooks/useWalletBalance';
import { Contract, parseEther, formatEther } from 'ethers';

// ============================================
// EXAMPLE 1: Display Wallet Info
// ============================================
export const WalletInfo: React.FC = () => {
  const { walletAddress, walletType, chainId } = useWallet();
  const { balance } = useWalletBalance();

  if (!walletAddress) {
    return <p>NOT CONNECTED</p>;
  }

  return (
    <div className="p-4 bg-zinc-900 border border-pink-500">
      <p className="text-xs font-mono text-zinc-400">ADDRESS</p>
      <p className="text-sm font-mono text-white">{walletAddress}</p>
      
      <p className="text-xs font-mono text-zinc-400 mt-2">WALLET</p>
      <p className="text-sm font-mono text-white">{walletType}</p>
      
      <p className="text-xs font-mono text-zinc-400 mt-2">BALANCE</p>
      <p className="text-sm font-mono text-white">{balance} ETH</p>
      
      <p className="text-xs font-mono text-zinc-400 mt-2">CHAIN ID</p>
      <p className="text-sm font-mono text-white">{chainId}</p>
    </div>
  );
};

// ============================================
// EXAMPLE 2: Wallet-Gated Component
// ============================================
export const WalletGatedMint: React.FC = () => {
  const { walletAddress } = useWallet();

  if (!walletAddress) {
    return (
      <div className="text-center p-8">
        <p className="text-xl font-black text-pink-500 mb-4">
          CONNECT WALLET TO MINT
        </p>
        <p className="text-sm font-mono text-zinc-400">
          YOU NEED A WALLET TO MINT NFTS
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2>MINT YOUR NFT</h2>
      {/* Your mint form here */}
    </div>
  );
};

// ============================================
// EXAMPLE 3: Read from Smart Contract
// ============================================
export const NFTBalance: React.FC<{ contractAddress: string }> = ({ contractAddress }) => {
  const { walletAddress, provider } = useWallet();
  const [nftBalance, setNftBalance] = React.useState<number>(0);

  React.useEffect(() => {
    const fetchNFTBalance = async () => {
      if (!walletAddress || !provider) return;

      try {
        // ERC-721 balanceOf function
        const contract = new Contract(
          contractAddress,
          ['function balanceOf(address owner) view returns (uint256)'],
          provider
        );

        const balance = await contract.balanceOf(walletAddress);
        setNftBalance(Number(balance));
      } catch (error) {
        console.error('Failed to fetch NFT balance:', error);
      }
    };

    fetchNFTBalance();
  }, [walletAddress, provider, contractAddress]);

  return (
    <div>
      <p className="text-xs font-mono text-zinc-400">YOUR NFTS</p>
      <p className="text-2xl font-black text-pink-500">{nftBalance}</p>
    </div>
  );
};

// ============================================
// EXAMPLE 4: Mint NFT Transaction
// ============================================
export const MintNFTButton: React.FC = () => {
  const { signer, walletAddress } = useWallet();
  const [isMinting, setIsMinting] = React.useState(false);
  const [txHash, setTxHash] = React.useState<string>('');

  const handleMint = async () => {
    if (!signer) {
      alert('CONNECT WALLET FIRST');
      return;
    }

    setIsMinting(true);
    setTxHash('');

    try {
      // Replace with your contract address and ABI
      const NFT_CONTRACT = '0xYourContractAddress';
      const contract = new Contract(
        NFT_CONTRACT,
        ['function mint() payable'],
        signer
      );

      // Send transaction with 0.01 ETH
      const tx = await contract.mint({
        value: parseEther('0.01')
      });

      setTxHash(tx.hash);

      // Wait for confirmation
      await tx.wait();

      alert('MINTED SUCCESSFULLY! 🎉');
    } catch (error: any) {
      console.error('Mint failed:', error);
      
      if (error.code === 'ACTION_REJECTED') {
        alert('TRANSACTION REJECTED');
      } else if (error.code === 'INSUFFICIENT_FUNDS') {
        alert('NOT ENOUGH ETH');
      } else {
        alert('MINT FAILED. TRY AGAIN.');
      }
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleMint}
        disabled={!walletAddress || isMinting}
        className="bg-pink-500 text-white px-6 py-3 font-black uppercase disabled:opacity-50"
      >
        {isMinting ? 'MINTING...' : 'MINT NFT (0.01 ETH)'}
      </button>

      {txHash && (
        <p className="text-xs font-mono text-zinc-400 mt-2">
          TX: {txHash.slice(0, 10)}...
          <a
            href={`https://sepolia.etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-500 ml-2"
          >
            VIEW ON ETHERSCAN
          </a>
        </p>
      )}
    </div>
  );
};

// ============================================
// EXAMPLE 5: Buy NFT Transaction
// ============================================
export const BuyNFTButton: React.FC<{ tokenId: number; price: string }> = ({ tokenId, price }) => {
  const { signer, walletAddress } = useWallet();
  const [isBuying, setIsBuying] = React.useState(false);

  const handleBuy = async () => {
    if (!signer) {
      alert('CONNECT WALLET FIRST');
      return;
    }

    setIsBuying(true);

    try {
      const MARKETPLACE_CONTRACT = '0xYourMarketplaceAddress';
      const contract = new Contract(
        MARKETPLACE_CONTRACT,
        ['function buyNFT(uint256 tokenId) payable'],
        signer
      );

      const tx = await contract.buyNFT(tokenId, {
        value: parseEther(price)
      });

      await tx.wait();
      alert('NFT PURCHASED! 🎉');
    } catch (error: any) {
      console.error('Purchase failed:', error);
      alert('PURCHASE FAILED');
    } finally {
      setIsBuying(false);
    }
  };

  return (
    <button
      onClick={handleBuy}
      disabled={!walletAddress || isBuying}
      className="bg-gradient-to-r from-pink-500 to-violet-500 text-white px-6 py-3 font-black uppercase disabled:opacity-50"
    >
      {isBuying ? 'BUYING...' : `BUY NOW (${price} ETH)`}
    </button>
  );
};

// ============================================
// EXAMPLE 6: Check Ownership
// ============================================
export const NFTOwnershipCheck: React.FC<{ contractAddress: string; tokenId: number }> = ({
  contractAddress,
  tokenId
}) => {
  const { walletAddress, provider } = useWallet();
  const [isOwner, setIsOwner] = React.useState(false);

  React.useEffect(() => {
    const checkOwnership = async () => {
      if (!walletAddress || !provider) return;

      try {
        const contract = new Contract(
          contractAddress,
          ['function ownerOf(uint256 tokenId) view returns (address)'],
          provider
        );

        const owner = await contract.ownerOf(tokenId);
        setIsOwner(owner.toLowerCase() === walletAddress.toLowerCase());
      } catch (error) {
        console.error('Failed to check ownership:', error);
        setIsOwner(false);
      }
    };

    checkOwnership();
  }, [walletAddress, provider, contractAddress, tokenId]);

  if (!walletAddress) return null;

  return (
    <div>
      {isOwner ? (
        <div className="bg-emerald-500/10 border border-emerald-500 p-3">
          <p className="text-emerald-400 font-mono text-xs">✓ YOU OWN THIS NFT</p>
        </div>
      ) : (
        <div className="bg-zinc-800 border border-zinc-700 p-3">
          <p className="text-zinc-400 font-mono text-xs">YOU DON'T OWN THIS NFT</p>
        </div>
      )}
    </div>
  );
};

// ============================================
// EXAMPLE 7: Send ETH
// ============================================
export const SendETHButton: React.FC<{ recipient: string; amount: string }> = ({
  recipient,
  amount
}) => {
  const { signer } = useWallet();
  const [isSending, setIsSending] = React.useState(false);

  const handleSend = async () => {
    if (!signer) return;

    setIsSending(true);

    try {
      const tx = await signer.sendTransaction({
        to: recipient,
        value: parseEther(amount)
      });

      await tx.wait();
      alert('ETH SENT! 🎉');
    } catch (error) {
      console.error('Send failed:', error);
      alert('SEND FAILED');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <button onClick={handleSend} disabled={isSending}>
      {isSending ? 'SENDING...' : `SEND ${amount} ETH`}
    </button>
  );
};

// ============================================
// EXAMPLE 8: Sign Message
// ============================================
export const SignMessageButton: React.FC = () => {
  const { signer, walletAddress } = useWallet();
  const [signature, setSignature] = React.useState<string>('');

  const handleSign = async () => {
    if (!signer) return;

    try {
      const message = `Sign this message to verify you own ${walletAddress}`;
      const sig = await signer.signMessage(message);
      setSignature(sig);
      alert('MESSAGE SIGNED! ✓');
    } catch (error) {
      console.error('Signing failed:', error);
      alert('SIGNING REJECTED');
    }
  };

  return (
    <div>
      <button onClick={handleSign} className="bg-violet-500 text-white px-4 py-2">
        SIGN MESSAGE
      </button>
      {signature && (
        <p className="text-xs font-mono text-zinc-400 mt-2 break-all">
          SIGNATURE: {signature}
        </p>
      )}
    </div>
  );
};
