import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { useENS } from '../hooks/useENS';

interface WalletAddressProps {
  address: string;
  className?: string;
  showCopyButton?: boolean;
  maxLength?: number;
}

/**
 * Reusable component for displaying wallet addresses with ENS support and copy functionality
 */
const WalletAddress: React.FC<WalletAddressProps> = ({
  address,
  className = '',
  showCopyButton = true,
  maxLength = 10,
}) => {
  const [copied, setCopied] = useState(false);
  const ensName = useENS(address);

  const shortenAddress = (addr: string) => {
    if (addr.length <= maxLength) return addr;
    const start = Math.floor(maxLength / 2);
    const end = maxLength - start - 1;
    return `${addr.slice(0, start)}...${addr.slice(-end)}`;
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = address;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        // Silent fail
      }
      document.body.removeChild(textArea);
    }
  };

  const displayText = ensName || shortenAddress(address);

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span
        className="cursor-pointer hover:text-pink-500 transition-colors"
        onClick={handleCopy}
        title={copied ? 'Copied!' : 'Click to copy'}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleCopy(e as any);
          }
        }}
        aria-label={`Wallet address: ${address}`}
      >
        {displayText}
      </span>
      {showCopyButton && (
        <button
          onClick={handleCopy}
          className="p-1 hover:bg-zinc-800 rounded transition-colors"
          title={copied ? 'Copied!' : 'Copy address'}
          aria-label="Copy wallet address"
        >
          {copied ? (
            <Check size={14} className="text-emerald-500" />
          ) : (
            <Copy size={14} className="text-zinc-500 hover:text-white" />
          )}
        </button>
      )}
    </span>
  );
};

export default WalletAddress;
