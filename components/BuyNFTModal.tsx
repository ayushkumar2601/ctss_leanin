import React, { useState, useEffect } from 'react';
import { X, Loader, AlertCircle } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import { purchaseNFT } from '../lib/services/marketplace-service';
import { estimateBuyGas, formatGasEstimate } from '../lib/utils/gas-estimation';

interface BuyNFTModalProps {
  nftId: string;
  tokenId: string;
  listingId: string;
  nftName: string;
  priceEth: string;
  sellerWallet: string;
  onClose: () => void;
  onSuccess: () => void;
}

const BuyNFTModal: React.FC<BuyNFTModalProps> = ({
  nftId,
  tokenId,
  listingId,
  nftName,
  priceEth,
  sellerWallet,
  onClose,
  onSuccess,
}) => {
  const { signer } = useWallet();
  const [isBuying, setIsBuying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gasEstimate, setGasEstimate] = useState<string>('');
  const [totalCost, setTotalCost] = useState<string>('');
  const [optimisticState, setOptimisticState] = useState<'idle' | 'buying' | 'success'>('idle');

  useEffect(() => {
    if (signer) {
      estimateGas();
    }
  }, [signer]);

  const estimateGas = async () => {
    if (!signer) return;
    
    try {
      const estimate = await estimateBuyGas(signer, tokenId, priceEth);
      setGasEstimate(formatGasEstimate(estimate));
      setTotalCost(estimate.totalCostEth || priceEth);
    } catch (err) {
      console.error('Gas estimation failed:', err);
    }
  };

  const handleBuy = async () => {
    if (!signer) {
      setError('Wallet not connected');
      return;
    }

    // Optimistic UI: Instant visual feedback
    setOptimisticState('buying');
    setIsBuying(true);
    setError(null);

    try {
      await purchaseNFT(signer, nftId, tokenId, listingId, priceEth, sellerWallet);
      
      // Success animation
      setOptimisticState('success');
      setTimeout(() => {
        onSuccess();
      }, 800);
    } catch (err: any) {
      console.error('Purchase failed:', err);
      setError(err.message || 'Failed to purchase NFT');
      setIsBuying(false);
      setOptimisticState('idle');
    }
  };

  const platformFee = (parseFloat(priceEth) * 2.5 / 100).toFixed(4);
  const sellerReceives = (parseFloat(priceEth) * 0.975).toFixed(4);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border-2 border-cyan-500 max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white"
          disabled={isBuying}
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-black uppercase mb-2">Buy NFT</h2>
        <p className="text-zinc-400 text-sm mb-6">{nftName}</p>

        <div className="space-y-4">
          <div className="bg-zinc-950 border border-zinc-800 p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-zinc-500 text-sm">Price</span>
              <span className="text-white font-mono">{priceEth} ETH</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-zinc-500 text-sm">Platform Fee (2.5%)</span>
              <span className="text-white font-mono">{platformFee} ETH</span>
            </div>

            {gasEstimate && (
              <div className="flex justify-between">
                <span className="text-zinc-500 text-sm">Est. Gas</span>
                <span className="text-white font-mono">{gasEstimate}</span>
              </div>
            )}

            <div className="border-t border-zinc-800 pt-3 flex justify-between">
              <span className="text-white font-bold">Total Cost</span>
              <span className="text-cyan-500 font-mono font-bold">{totalCost} ETH</span>
            </div>
          </div>

          <div className="bg-zinc-950 border border-zinc-700 p-3">
            <p className="text-xs text-zinc-400">
              Seller receives: <span className="text-white font-mono">{sellerReceives} ETH</span>
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500 p-3 flex items-start gap-2">
              <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          <button
            onClick={handleBuy}
            disabled={isBuying}
            className={`w-full font-black uppercase py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-300 ${
              optimisticState === 'success' 
                ? 'bg-emerald-500 text-white scale-105' 
                : 'bg-cyan-500 hover:bg-cyan-600 text-black'
            }`}
          >
            {optimisticState === 'success' ? (
              <>
                <span className="animate-bounce">✓</span>
                Purchase Complete!
              </>
            ) : isBuying ? (
              <>
                <Loader className="animate-spin" size={20} />
                Purchasing...
              </>
            ) : (
              'Confirm Purchase'
            )}
          </button>

          <p className="text-xs text-zinc-500 text-center">
            This transaction cannot be reversed
          </p>
        </div>
      </div>
    </div>
  );
};

export default BuyNFTModal;
