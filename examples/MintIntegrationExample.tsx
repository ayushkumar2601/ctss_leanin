/**
 * MINT INTEGRATION EXAMPLE
 * 
 * This shows how to integrate Supabase NFT saving
 * into your existing mint flow
 */

import React, { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { saveMintedNFT } from '../lib/supabase/nft-service';
import { Contract, parseEther } from 'ethers';

const MintIntegrationExample: React.FC = () => {
  const { signer, walletAddress, chainId } = useWallet();
  const [isMinting, setIsMinting] = useState(false);
  const [txHash, setTxHash] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleMint = async () => {
    if (!signer || !walletAddress) {
      setError('Please connect your wallet first');
      return;
    }

    setIsMinting(true);
    setError('');
    setTxHash('');

    try {
      // =====================================================
      // STEP 1: MINT NFT ON BLOCKCHAIN
      // =====================================================
      
      const NFT_CONTRACT_ADDRESS = '0xYourContractAddress';
      const NFT_ABI = [
        'function mint(string memory tokenURI) public payable returns (uint256)',
        'function tokenURI(uint256 tokenId) public view returns (string)',
      ];

      const contract = new Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, signer);

      // Prepare metadata
      const metadata = {
        name: 'GLITCHED SOUL #001',
        description: 'A chaotic digital masterpiece',
        image: 'ipfs://QmYourImageHash',
        attributes: [
          { trait_type: 'Rarity', value: 'Legendary' },
          { trait_type: 'Style', value: 'Glitchcore' },
          { trait_type: 'Energy', value: 'Chaotic' },
        ],
      };

      // Upload metadata to IPFS (or your storage)
      const metadataUri = 'ipfs://QmYourMetadataHash'; // Replace with actual upload

      // Mint NFT
      const tx = await contract.mint(metadataUri, {
        value: parseEther('0.01'), // Mint price
      });

      setTxHash(tx.hash);

      // Wait for transaction confirmation
      const receipt = await tx.wait();

      // =====================================================
      // STEP 2: EXTRACT TOKEN ID FROM TRANSACTION
      // =====================================================
      
      // Parse Transfer event to get token ID
      // This depends on your contract's event structure
      const transferEvent = receipt.logs.find(
        (log: any) => log.topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
      );

      if (!transferEvent) {
        throw new Error('Could not find Transfer event');
      }

      // Token ID is typically the 4th topic in Transfer event
      const tokenId = parseInt(transferEvent.topics[3], 16).toString();

      // =====================================================
      // STEP 3: SAVE TO SUPABASE
      // =====================================================
      
      await saveMintedNFT({
        tokenId: tokenId,
        contractAddress: NFT_CONTRACT_ADDRESS,
        chainId: chainId || 11155111,
        ownerWallet: walletAddress,
        name: metadata.name,
        description: metadata.description,
        imageUrl: metadata.image,
        metadataUri: metadataUri,
        mintTxHash: tx.hash,
        mintedAt: new Date(),
        attributes: metadata.attributes,
      });

      // =====================================================
      // STEP 4: SUCCESS!
      // =====================================================
      
      alert(`NFT Minted Successfully! Token ID: ${tokenId}`);
      
      // Redirect to dashboard to see the NFT
      window.location.href = '/#/dashboard';

    } catch (err: any) {
      console.error('Mint failed:', err);
      
      if (err.code === 'ACTION_REJECTED') {
        setError('Transaction rejected by user');
      } else if (err.code === 'INSUFFICIENT_FUNDS') {
        setError('Insufficient funds for minting');
      } else {
        setError(err.message || 'Minting failed');
      }
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="p-6 bg-zinc-900 border border-pink-500">
      <h2 className="text-2xl font-black text-white mb-4">MINT NFT</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500 text-red-400 text-sm">
          {error}
        </div>
      )}

      {txHash && (
        <div className="mb-4 p-3 bg-green-500/10 border border-green-500 text-green-400 text-sm">
          Transaction: {txHash.slice(0, 10)}...
          <a
            href={`https://sepolia.etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 underline"
          >
            View on Etherscan
          </a>
        </div>
      )}

      <button
        onClick={handleMint}
        disabled={isMinting || !walletAddress}
        className="w-full bg-gradient-to-r from-pink-500 to-violet-500 text-white py-4 px-6 font-black uppercase disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isMinting ? 'MINTING...' : 'MINT NFT (0.01 ETH)'}
      </button>

      <div className="mt-4 p-4 bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-400">
        <p className="font-bold text-white mb-2">INTEGRATION STEPS:</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Mint NFT on blockchain</li>
          <li>Wait for transaction confirmation</li>
          <li>Extract token ID from event logs</li>
          <li>Save NFT data to Supabase</li>
          <li>Redirect to dashboard</li>
        </ol>
      </div>
    </div>
  );
};

export default MintIntegrationExample;

/**
 * SIMPLIFIED VERSION (Minimal Code)
 */

export const simpleMintAndSave = async (
  signer: any,
  walletAddress: string,
  chainId: number
) => {
  // 1. Mint NFT
  const contract = new Contract('0xYourContract', ['function mint() payable'], signer);
  const tx = await contract.mint({ value: parseEther('0.01') });
  const receipt = await tx.wait();

  // 2. Get token ID (adjust based on your contract)
  const tokenId = '1'; // Extract from events

  // 3. Save to Supabase
  await saveMintedNFT({
    tokenId,
    contractAddress: '0xYourContract',
    chainId,
    ownerWallet: walletAddress,
    name: 'My NFT',
    description: 'Description',
    imageUrl: 'https://...',
    metadataUri: 'ipfs://...',
    mintTxHash: tx.hash,
    mintedAt: new Date(),
  });

  // 4. Done!
  return tokenId;
};
