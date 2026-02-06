import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Heart, Share2, User, Globe, Info, 
  ShieldCheck, Download, 
  AlertCircle, ExternalLink, RefreshCw, DollarSign
} from 'lucide-react';
import { getNFTById } from '../lib/services/nftService';
import { getActiveListing, cancelListingService } from '../lib/services/marketplace-service';
import type { NFTWithAttributes, Listing } from '../lib/supabase/types';
import { useWallet } from '../contexts/WalletContext';
import SellNFTModal from '../components/SellNFTModal';
import BuyNFTModal from '../components/BuyNFTModal';
import TimeDisplay from '../components/TimeDisplay';
import WalletAddress from '../components/WalletAddress';
import SepoliaBadge from '../components/SepoliaBadge';
import ExplorerLinks from '../components/ExplorerLinks';

const NFTDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { walletAddress, signer } = useWallet();
  const [nft, setNft] = useState<NFTWithAttributes | null>(null);
  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [gatewayIndex, setGatewayIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);
  const [showSellModal, setShowSellModal] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelOptimistic, setCancelOptimistic] = useState<'idle' | 'cancelling' | 'success'>('idle');

  useEffect(() => {
    if (id) {
      fetchNFT(id);
    }
  }, [id]);

  const fetchNFT = async (nftId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getNFTById(nftId);
      if (!data) {
        setError('NFT not found');
      } else {
        setNft(data);
        await fetchListing(nftId);
      }
    } catch (err: any) {
      console.error('Error fetching NFT:', err);
      setError('Failed to load NFT');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchListing = async (nftId: string) => {
    try {
      const listingData = await getActiveListing(nftId);
      setListing(listingData);
    } catch (err) {
      console.error('Error fetching listing:', err);
    }
  };

  const handleCancelListing = async () => {
    if (!signer || !nft || !listing) return;
    
    // Optimistic UI: Instant visual feedback
    setCancelOptimistic('cancelling');
    setIsCancelling(true);
    try {
      await cancelListingService(signer, nft.id, nft.token_id, listing.id);
      
      // Success animation
      setCancelOptimistic('success');
      setTimeout(async () => {
        await fetchListing(nft.id);
        setCancelOptimistic('idle');
      }, 800);
    } catch (err: any) {
      console.error('Cancel failed:', err);
      alert('Failed to cancel listing: ' + err.message);
      setCancelOptimistic('idle');
    } finally {
      setIsCancelling(false);
    }
  };

  const handleSellSuccess = () => {
    setShowSellModal(false);
    if (nft) {
      fetchListing(nft.id);
    }
  };

  const handleBuySuccess = () => {
    setShowBuyModal(false);
    if (id) {
      fetchNFT(id);
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen pt-12 pb-24 px-6 max-w-7xl mx-auto flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-pink-500 mb-4 inline-block">
            <RefreshCw size={48} />
          </div>
          <p className="text-zinc-400 font-mono text-sm uppercase">Loading NFT...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !nft) {
    return (
      <div className="min-h-screen pt-12 pb-24 px-6 max-w-7xl mx-auto flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-red-500/10 border-2 border-red-500 flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={40} className="text-red-500" />
          </div>
          <h2 className="text-3xl font-black text-white mb-3 uppercase">
            {error || 'NFT Not Found'}
          </h2>
          <p className="text-zinc-400 font-mono text-sm mb-6 uppercase">
            This NFT doesn't exist or has been removed.
          </p>
          <Link
            to="/explore"
            className="inline-block px-8 py-3 bg-pink-500 text-white font-black uppercase hover:bg-pink-600 transition-colors"
          >
            EXPLORE NFTs
          </Link>
        </div>
      </div>
    );
  }

  // Multiple IPFS gateways for fallback (CORS-friendly gateways first)
  const gateways = [
    'https://ipfs.io/ipfs/',
    'https://cloudflare-ipfs.com/ipfs/',
    'https://dweb.link/ipfs/',
    'https://gateway.pinata.cloud/ipfs/',
  ];
  
  // Convert IPFS URI to gateway URL
  const getImageUrl = () => {
    if (!nft.image_url) return '';
    
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
  
  console.log('🖼️ NFT Detail Image:', {
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
  
  const explorerUrl = `https://sepolia.etherscan.io/tx/${nft.mint_tx_hash}`;
  const contractUrl = `https://sepolia.etherscan.io/address/${nft.contract_address}`;

  return (
    <div className="min-h-screen pt-12 pb-24 px-6 max-w-7xl mx-auto relative">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left: Artwork */}
        <div className="space-y-6">
          <div className="relative group rounded-3xl overflow-hidden neon-border">
            {/* Loading Spinner */}
            {imageLoading && !imageError && (
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-950 z-10">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-pink-500"></div>
              </div>
            )}
            
            {imageUrl && !imageError ? (
              <img 
                src={imageUrl} 
                alt={nft.name} 
                className={`w-full aspect-square object-cover transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                onError={handleImageError}
                onLoad={handleImageLoad}
              />
            ) : (
              <div className="w-full aspect-square bg-zinc-900 flex items-center justify-center">
                <p className="text-zinc-600 font-mono text-sm">NO IMAGE</p>
              </div>
            )}
            
            {/* Authenticity Badge */}
            <div className="absolute top-6 left-6 z-20">
              <div className="flex items-center gap-2 bg-emerald-500/20 backdrop-blur-xl border border-emerald-500/50 px-4 py-2 rounded-xl text-emerald-400">
                <ShieldCheck size={16} fill="currentColor" className="text-emerald-500" />
                <span className="font-mono text-[10px] uppercase font-bold">Blockchain Verified</span>
              </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="absolute bottom-6 left-6 flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-xl">
               <span className="w-2 h-2 rounded-full bg-violet-500 shadow-[0_0_8px_#8b5cf6]"></span>
               <span className="font-mono text-[10px] uppercase font-bold tracking-widest">Token #{nft.token_id}</span>
            </div>
          </div>

          {/* Blockchain Info */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-black italic uppercase flex items-center gap-2">
              <Globe size={16} className="text-cyan-500" /> Blockchain Data
            </h3>
            
            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-zinc-500">Contract:</span>
                <a 
                  href={contractUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-500 hover:text-cyan-400 flex items-center gap-1"
                >
                  {nft.contract_address.slice(0, 6)}...{nft.contract_address.slice(-4)}
                  <ExternalLink size={10} />
                </a>
              </div>
              
              <div className="flex justify-between">
                <span className="text-zinc-500">Token ID:</span>
                <span className="text-white">#{nft.token_id}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-zinc-500">Chain:</span>
                <span className="text-white">Sepolia ({nft.chain_id})</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-zinc-500">Minted:</span>
                <TimeDisplay date={nft.minted_at} className="text-white" />
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">Transaction:</span>
                <a 
                  href={explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-500 hover:text-cyan-400 flex items-center gap-1"
                >
                  View on Etherscan
                  <ExternalLink size={10} />
                </a>
              </div>
            </div>
          </div>

          {/* Attributes */}
          {nft.attributes && nft.attributes.length > 0 && (
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6">
              <h3 className="text-sm font-black italic uppercase mb-4">Attributes</h3>
              <div className="grid grid-cols-2 gap-3">
                {nft.attributes.map((attr, idx) => (
                  <div key={idx} className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl">
                    <p className="text-[10px] font-mono text-zinc-500 uppercase mb-1">
                      {attr.trait_type}
                    </p>
                    <p className="text-sm font-bold text-white truncate">
                      {attr.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Info */}
        <div className="space-y-8">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase leading-none">
                  {nft.name}
                </h1>
                
                {/* Explorer Quick Links */}
                <ExplorerLinks
                  chainId={nft.chain_id}
                  txHash={nft.mint_tx_hash}
                  contractAddress={nft.contract_address}
                  tokenId={nft.token_id}
                  iconSize={18}
                />
              </div>

              {/* Sepolia Badge */}
              <div className="mb-6">
                <SepoliaBadge
                  chainId={nft.chain_id}
                  txHash={nft.mint_tx_hash}
                  contractAddress={nft.contract_address}
                />
              </div>
              
              <div className="flex flex-wrap gap-4 items-center mb-6">
                 <div className="flex items-center gap-2">
                    <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-violet-500 p-[1px]">
                      <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center overflow-hidden">
                         <User size={20} className="text-zinc-500" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <p className="text-[10px] text-zinc-500 font-mono">OWNER</p>
                      </div>
                      <WalletAddress 
                        address={nft.owner_wallet}
                        showCopyButton={true}
                        className="text-xs font-bold text-pink-500 font-mono"
                      />
                    </div>
                 </div>
              </div>

              {nft.description && (
                <p className="text-zinc-400 font-mono text-sm leading-relaxed mb-6">
                  {nft.description}
                </p>
              )}
            </div>
          </div>

          {/* Listing Info */}
          {listing && (
            <div className="bg-gradient-to-r from-cyan-500/10 to-pink-500/10 border-2 border-cyan-500/50 p-6 rounded-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-zinc-400 uppercase mb-1 font-mono">Current Price</p>
                  <div className="flex items-center gap-2">
                    <DollarSign size={24} className="text-cyan-500" />
                    <p className="text-3xl font-black text-cyan-500">{listing.price_eth} ETH</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-zinc-400 uppercase mb-1 font-mono">Seller</p>
                  <p className="text-sm font-mono text-white">
                    {listing.seller_wallet.slice(0, 6)}...{listing.seller_wallet.slice(-4)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Marketplace Actions */}
          <div className="space-y-4">
            {(() => {
              console.log('🔍 Marketplace Debug:', {
                hasWallet: !!walletAddress,
                walletAddress: walletAddress,
                nftOwner: nft?.owner_wallet,
                match: walletAddress && nft && walletAddress.toLowerCase() === nft.owner_wallet.toLowerCase(),
                hasListing: !!listing
              });
              
              if (!walletAddress) {
                return (
                  <div className="w-full px-6 py-4 bg-yellow-500/10 border border-yellow-500 text-yellow-500 font-black uppercase text-center">
                    Connect Wallet to Interact
                  </div>
                );
              }
              
              if (walletAddress && nft && walletAddress.toLowerCase() === nft.owner_wallet.toLowerCase()) {
                // Owner buttons
                if (listing) {
                  return (
                    <button
                      onClick={handleCancelListing}
                      disabled={isCancelling}
                      className={`w-full px-6 py-4 font-black uppercase disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ${
                        cancelOptimistic === 'success'
                          ? 'bg-emerald-500 text-white scale-105'
                          : 'bg-red-500 hover:bg-red-600 text-white'
                      }`}
                    >
                      {cancelOptimistic === 'success' ? (
                        <>
                          <span className="animate-bounce">✓</span> Listing Cancelled!
                        </>
                      ) : isCancelling ? (
                        'Cancelling...'
                      ) : (
                        'Cancel Listing'
                      )}
                    </button>
                  );
                } else {
                  return (
                    <button
                      onClick={() => setShowSellModal(true)}
                      className="w-full px-6 py-4 bg-pink-500 hover:bg-pink-600 text-white font-black uppercase transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                      List for Sale
                    </button>
                  );
                }
              } else if (listing) {
                // Buyer button
                return (
                  <button
                    onClick={() => setShowBuyModal(true)}
                    className="w-full px-6 py-4 bg-cyan-500 hover:bg-cyan-600 text-black font-black uppercase transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    Buy Now - {listing.price_eth} ETH
                  </button>
                );
              } else {
                return (
                  <div className="w-full px-6 py-4 bg-zinc-900 border border-zinc-800 text-zinc-500 font-black uppercase text-center">
                    Not Listed for Sale
                  </div>
                );
              }
            })()}
            
            <div className="flex gap-2">
              <button className="flex-1 p-3 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-pink-500 transition-colors flex items-center justify-center gap-2">
                <Heart size={20} />
                <span className="text-sm font-mono">Like</span>
              </button>
              <button className="flex-1 p-3 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-cyan-500 transition-colors flex items-center justify-center gap-2">
                <Share2 size={20} />
                <span className="text-sm font-mono">Share</span>
              </button>
            </div>
          </div>

          {/* Metadata URI */}
          {nft.metadata_uri && (
            <div className="bg-zinc-900/30 border border-zinc-800 p-6 rounded-3xl">
              <h4 className="text-[10px] font-black italic text-zinc-500 mb-3 uppercase flex items-center gap-2">
                <Info size={14} /> Metadata
              </h4>
              <a
                href={nft.metadata_uri.startsWith('ipfs://')
                  ? `https://gateway.pinata.cloud/ipfs/${nft.metadata_uri.replace('ipfs://', '')}`
                  : nft.metadata_uri
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-cyan-500 hover:text-cyan-400 flex items-center gap-2 break-all"
              >
                {nft.metadata_uri}
                <ExternalLink size={12} className="flex-shrink-0" />
              </a>
            </div>
          )}

          {/* Back to Explore */}
          <Link
            to="/explore"
            className="block w-full py-4 text-center border-2 border-zinc-800 text-zinc-400 font-black italic text-lg hover:border-pink-500 hover:text-pink-500 transition-all uppercase"
          >
            ← BACK TO EXPLORE
          </Link>
        </div>
      </div>

      {/* Sell Modal */}
      {showSellModal && nft && (
        <SellNFTModal
          nftId={nft.id}
          tokenId={nft.token_id}
          nftName={nft.name}
          onClose={() => setShowSellModal(false)}
          onSuccess={handleSellSuccess}
        />
      )}

      {/* Buy Modal */}
      {showBuyModal && nft && listing && (
        <BuyNFTModal
          nftId={nft.id}
          tokenId={nft.token_id}
          listingId={listing.id}
          nftName={nft.name}
          priceEth={listing.price_eth}
          sellerWallet={listing.seller_wallet}
          onClose={() => setShowBuyModal(false)}
          onSuccess={handleBuySuccess}
        />
      )}
    </div>
  );
};

export default NFTDetail;
