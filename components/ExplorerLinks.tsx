import React from 'react';
import { ExternalLink, FileText, Box } from 'lucide-react';
import { getExplorerUrl } from '../lib/utils/explorer';

interface ExplorerLinksProps {
  chainId: number;
  txHash?: string;
  contractAddress?: string;
  tokenId?: string;
  className?: string;
  iconSize?: number;
}

/**
 * External explorer quick links component
 * Displays icon-only links to blockchain explorer
 */
const ExplorerLinks: React.FC<ExplorerLinksProps> = ({
  chainId,
  txHash,
  contractAddress,
  tokenId,
  className = '',
  iconSize = 16,
}) => {
  const links = [
    {
      type: 'transaction' as const,
      value: txHash,
      icon: FileText,
      label: 'View Transaction',
      tooltip: 'View transaction on explorer',
    },
    {
      type: 'contract' as const,
      value: contractAddress,
      icon: Box,
      label: 'View Contract',
      tooltip: 'View contract on explorer',
    },
    {
      type: 'token' as const,
      value: contractAddress && tokenId ? `${contractAddress}?a=${tokenId}` : undefined,
      icon: ExternalLink,
      label: 'View Token',
      tooltip: 'View token on explorer',
    },
  ];

  const visibleLinks = links.filter(link => link.value);

  if (visibleLinks.length === 0) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {visibleLinks.map((link, index) => {
        const url = link.type === 'token' && link.value
          ? getExplorerUrl('token', contractAddress!, chainId)
          : getExplorerUrl(link.type, link.value!, chainId);

        if (!url) return null;

        const Icon = link.icon;

        return (
          <a
            key={index}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-zinc-800/50 hover:bg-zinc-700 border border-zinc-700 hover:border-cyan-500 rounded-lg transition-all duration-200 group"
            title={link.tooltip}
            aria-label={link.label}
          >
            <Icon 
              size={iconSize} 
              className="text-zinc-400 group-hover:text-cyan-400 transition-colors" 
            />
          </a>
        );
      })}
    </div>
  );
};

export default ExplorerLinks;
