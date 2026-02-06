import React, { useState } from 'react';
import { X, DollarSign, Loader } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import { createListing } from '../lib/services/marketplace-service';
import { estimateApprovalGas, estimateListGas, formatGasEstimate } from '../lib/utils/gas-estimation';

interface SellNFTModalProps {
  nftId: string;
  tokenId: string;
  nftName: string;
  onClose: () => void;
  onSuccess: () => void;
}

const SellNFTModal: React.FC<SellNFTModalProps> = ({
  nftId,
  tokenId,
  nftName,
  onClose,
  onSuccess,
}) => {
  const { signer } = useWallet();
  const [price, setPrice] = useState('');
  const [isListing, setIsListing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gasEstimate, setGasEstimate] = useState<string>('');
  const [optimisticState, setOptimisticState] = useState<'idle' | 'approving' | 'listing' | 'success'>('idle');

  const handlePriceChange = async (value: string) => {
    setPrice(value);
    setError(null);
    
    if (value && parseFloat(value) > 0 && signer) {
      try {
        const estimate = await estimateListGas(signer, tokenId, value);
        setGasEstimate(formatGasEstimate(estimate));
      } catch (err) {
        console.error('Gas estimation failed:', err);
      }
    } else {
      setGasEstimate('');
    }
  };

  const handleList = async () => {
    if (!signer) {
      setError('Wallet not connected');
      return;
    }

    if (!price || parseFloat(price) <= 0) {
      setError('Please enter a valid price');
      return;
    }

    // Optimistic UI: Instant visual feedback
    setOptimisticState('approving');
    setIsListing(true);
    setError(null);

    try {
      await createListing(signer, nftId, tokenId, price);
      
      // Success animation
      setOptimisticState('success');
      setTimeout(() => {
        onSuccess();
      }, 800);
    } catch (err: any) {
      console.error('Listing failed:', err);
      setError(err.message || 'Failed to list NFT');
      setIsListing(false);
      setOptimisticState('idle');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border-2 border-pink-500 max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white"
          disabled={isListing}
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-black uppercase mb-2">List for Sale</h2>
        <p className="text-zinc-400 text-sm mb-6">{nftName}</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-mono text-zinc-400 mb-2">
              Price (ETH)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
              <input
                type="number"
                step="0.001"
                min="0"
                value={price}
                onChange={(e) => handlePriceChange(e.target.value)}
                placeholder="0.00"
                disabled={isListing}
                className="w-full bg-zinc-950 border border-zinc-800 pl-10 pr-4 py-3 text-white font-mono focus:border-pink-500 focus:outline-none disabled:opacity-50"
              />
            </div>
          </div>

          {gasEstimate && (
            <div className="bg-zinc-950 border border-zinc-800 p-3">
              <p className="text-xs text-zinc-500 mb-1">Estimated Gas</p>
              <p className="text-sm font-mono text-white">{gasEstimate}</p>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500 p-3">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          <button
            onClick={handleList}
            disabled={isListing || !price || parseFloat(price) <= 0}
            className={`w-full font-black uppercase py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-300 ${
              optimisticState === 'success' 
                ? 'bg-emerald-500 text-white scale-105' 
                : 'bg-pink-500 hover:bg-pink-600 text-white'
            }`}
          >
            {optimisticState === 'success' ? (
              <>
                <span className="animate-bounce">✓</span>
                Listed Successfully!
              </>
            ) : isListing ? (
              <>
                <Loader className="animate-spin" size={20} />
                {optimisticState === 'approving' ? 'Approving...' : 'Listing...'}
              </>
            ) : (
              'List NFT'
            )}
          </button>

          <p className="text-xs text-zinc-500 text-center">
            Platform fee: 2.5% • You'll receive {price ? (parseFloat(price) * 0.975).toFixed(4) : '0'} ETH
          </p>
        </div>
      </div>
    </div>
  );
};

export default SellNFTModal;
