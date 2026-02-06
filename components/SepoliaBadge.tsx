import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { getExplorerUrl, isSepolia } from '../lib/utils/explorer';

interface SepoliaBadgeProps {
  chainId: number;
  txHash?: string;
  contractAddress?: string;
  className?: string;
}

/**
 * Verified on Sepolia badge component
 * Shows a trust badge for Sepolia-verified NFTs
 */
const SepoliaBadge: React.FC<SepoliaBadgeProps> = ({
  chainId,
  txHash,
  contractAddress,
  className = '',
}) => {
  // Only show badge for Sepolia
  if (!isSepolia(chainId)) {
    return null;
  }

  // Determine which URL to use (prefer transaction, fallback to contract)
  const explorerUrl = txHash 
    ? getExplorerUrl('transaction', txHash, chainId)
    : contractAddress 
    ? getExplorerUrl('contract', contractAddress, chainId)
    : null;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (explorerUrl) {
      window.open(explorerUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={!explorerUrl}
      className={`inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all duration-200 ${
        explorerUrl ? 'cursor-pointer' : 'cursor-default'
      } ${className}`}
      title="This NFT is verified on Ethereum Sepolia"
      aria-label="Verified on Ethereum Sepolia"
    >
      <ShieldCheck size={14} className="text-emerald-500" />
      <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
        Verified on Sepolia
      </span>
    </button>
  );
};

export default SepoliaBadge;
