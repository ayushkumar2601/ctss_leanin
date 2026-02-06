import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Calendar, Hash, Network } from 'lucide-react';
import type { NFTWithAttributes } from '../lib/supabase/types';
import TimeDisplay from './TimeDisplay';

interface NFTCardProps {
  nft: NFTWithAttributes;
}

const NFTCard: React.FC<NFTCardProps> = ({ nft }) => {
  const [imageError, setImageError] = useState(false);
  const [showMetadata, setShowMetadata] = useState(false);
  const [gatewayIndex, setGatewayIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);



  const getNetworkName = (chainId: number) => {
    return chainId === 11155111 ? 'Sepolia' : `Chain ${chainId}`;
  };

  const getExplorerUrl = (txHash: string) => {
    return `https://sepolia.etherscan.io/tx/${txHash}`;
  };

  const placeholderImage = 'https://via.placeholder.com/400x400/1a1a1a/ec4899?text=NFT';
  
  // Multiple IPFS gateways for fallback (CORS-friendly gateways first)
  const gateways = [
    'https://ipfs.io/ipfs/',
    'https://cloudflare-ipfs.com/ipfs/',
    'https://dweb.link/ipfs/',
    'https://gateway.pinata.cloud/ipfs/',
  ];
  
  // Convert IPFS URI to gateway URL with fallback support
  const getImageUrl = () => {
    if (!nft.image_url) return placeholderImage;
    
    // Extract IPFS hash from any format
    let hash = '';
    if (nft.image_url.startsWith('ipfs://')) {
      hash = nft.image_url.replace('ipfs://', '');
    } else if (nft.image_url.includes('/ipfs/')) {
      // Extract hash from gateway URL
      hash = nft.image_url.split('/ipfs/')[1];
    } else if (nft.image_url.startsWith('http://') || nft.image_url.startsWith('https://')) {
      // Already a full URL but not IPFS - use as-is
      return nft.image_url;
    } else {
      // Assume it's just the hash
      hash = nft.image_url;
    }
    
    // Use fallback gateway
    const gateway = gateways[gatewayIndex] || gateways[0];
    return `${gateway}${hash}`;
  };
  
  const imageUrl = getImageUrl();
  
  console.log('🖼️ NFT Card Image:', {
    name: nft.name,
    tokenId: nft.token_id,
    stored: nft.image_url,
    display: imageUrl,
    gateway: gatewayIndex,
    gatewayUrl: gateways[gatewayIndex]
  });
  
  const handleImageError = () => {
    console.error('❌ Image failed to load:', imageUrl);
    
    // Try next gateway
    if (gatewayIndex < gateways.length - 1) {
      console.log(`⚠️ Trying gateway ${gatewayIndex + 1}...`);
      setImageLoading(true);
      setGatewayIndex(gatewayIndex + 1);
    } else {
      console.error('❌ All gateways failed for:', nft.image_url);
      setImageError(true);
      setImageLoading(false);
    }
  };
  
  const handleImageLoad = () => {
    console.log('✅ Image loaded successfully:', imageUrl);
    setImageLoading(false);
  };

  return (
    <div className="group relative bg-zinc-900 border border-zinc-800 hover:border-pink-500 transition-all duration-300 overflow-hidden">
      {/* Clickable area for NFT detail */}
      <Link to={`/nft/${nft.id}`} className="block cursor-pointer">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-zinc-950">
        {/* Loading Spinner */}
        {imageLoading && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-950">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
          </div>
        )}
        
        <img
          src={imageError ? placeholderImage : imageUrl}
          alt={nft.name}
          onError={handleImageError}
          onLoad={handleImageLoad}
          className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
        />
        
        {/* Network Badge */}
        <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full border border-pink-500/50">
          <div className="flex items-center gap-1.5">
            <Network size={12} className="text-pink-500" />
            <span className="text-[10px] font-mono text-pink-500 uppercase">
              {getNetworkName(nft.chain_id)}
            </span>
          </div>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Name */}
        <h3 className="text-lg font-black text-white truncate group-hover:text-pink-500 transition-colors">
          {nft.name}
        </h3>

        {/* Description */}
        {nft.description && (
          <p className="text-xs text-zinc-400 line-clamp-2 font-mono">
            {nft.description}
          </p>
        )}

        {/* Metadata */}
        <div className="space-y-2">
          {/* Token ID */}
          <div className="flex items-center gap-2 text-xs">
            <Hash size={14} className="text-zinc-500" />
            <span className="font-mono text-zinc-400">Token ID:</span>
            <span className="font-mono text-white">{nft.token_id}</span>
          </div>

          {/* Mint Date */}
          <div className="flex items-center gap-2 text-xs">
            <Calendar size={14} className="text-zinc-500" />
            <span className="font-mono text-zinc-400">Minted:</span>
            <TimeDisplay date={nft.minted_at} className="font-mono text-white" />
          </div>
        </div>
      </div>
      </Link>

      {/* Actions - Outside Link to avoid nested anchors */}
      <div className="px-4 pb-4">
        {/* Attributes */}
        {nft.attributes && nft.attributes.length > 0 && (
          <div className="pt-3 border-t border-zinc-800 mb-3">
            <button
              onClick={() => setShowMetadata(!showMetadata)}
              className="text-xs font-mono text-pink-500 hover:text-pink-400 transition-colors"
            >
              {showMetadata ? 'HIDE' : 'SHOW'} ATTRIBUTES ({nft.attributes.length})
            </button>

            {showMetadata && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {nft.attributes.map((attr, idx) => (
                  <div
                    key={idx}
                    className="bg-zinc-950 border border-zinc-800 p-2 rounded"
                  >
                    <p className="text-[10px] font-mono text-zinc-500 uppercase mb-1">
                      {attr.trait_type}
                    </p>
                    <p className="text-xs font-mono text-white truncate">
                      {attr.value}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="pt-3 border-t border-zinc-800 flex gap-2">
          {/* View on Etherscan */}
          <a
            href={getExplorerUrl(nft.mint_tx_hash)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-zinc-800 hover:bg-pink-500 text-white py-2 px-3 text-xs font-bold uppercase transition-colors"
          >
            <ExternalLink size={14} />
            <span>VIEW TX</span>
          </a>

          {/* View Metadata */}
          {nft.metadata_uri && (
            <a
              href={nft.metadata_uri.startsWith('ipfs://') 
                ? `https://gateway.pinata.cloud/ipfs/${nft.metadata_uri.replace('ipfs://', '')}`
                : nft.metadata_uri
              }
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-violet-500 text-white py-2 px-3 text-xs font-bold uppercase transition-colors"
            >
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default NFTCard;
