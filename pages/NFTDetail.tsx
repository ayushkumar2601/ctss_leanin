import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Heart, Share2, User, Globe, Info, 
  ShieldCheck, CheckCircle, AlertTriangle,
  AlertCircle, ExternalLink, RefreshCw
} from 'lucide-react';
import { getNFTById } from '../lib/services/nftService';
import type { NFTWithAttributes } from '../lib/supabase/types';
import { useWallet } from '../contexts/WalletContext';
import TimeDisplay from '../components/TimeDisplay';
import WalletAddress from '../components/WalletAddress';
import SepoliaBadge from '../components/SepoliaBadge';
import ExplorerLinks from '../components/ExplorerLinks';

const NFTDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { walletAddress } = useWallet();
  const [nft, setNft] = useState<NFTWithAttributes | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [gatewayIndex, setGatewayIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState('');

  // Mock status - in production this would come from database
  const [issueStatus, setIssueStatus] = useState<'Open' | 'Resolved'>('Open');

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
        setError('Issue not found');
      } else {
        setNft(data);
        // Check status from attributes if available
        const statusAttr = data.attributes?.find(a => a.trait_type === 'Status');
        if (statusAttr && (statusAttr.value === 'Open' || statusAttr.value === 'Resolved')) {
          setIssueStatus(statusAttr.value as 'Open' | 'Resolved');
        }
      }
    } catch (err: any) {
      console.error('Error fetching issue:', err);
      setError('Failed to load issue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseIssue = async () => {
    if (!walletAddress || !nft) return;
    
    setIsClosing(true);
    try {
      // TODO: Update database to mark issue as resolved
      // For now, just update local state
      setIssueStatus('Resolved');
      setShowCloseConfirm(false);
      
      // Show success message
      alert('Issue marked as resolved successfully!');
      
      // Refresh data
      if (id) {
        await fetchNFT(id);
      }
    } catch (err: any) {
      console.error('Close issue failed:', err);
      alert('Failed to close issue: ' + err.message);
    } finally {
      setIsClosing(false);
    }
  };

  // Get severity from attributes (mock logic)
  const getSeverity = (): 'Low' | 'Medium' | 'High' => {
    const severityAttr = nft?.attributes?.find(a => a.trait_type === 'Urgency' || a.trait_type === 'Severity');
    if (severityAttr) {
      const value = severityAttr.value.toLowerCase();
      if (value === 'high') return 'High';
      if (value === 'medium') return 'Medium';
      return 'Low';
    }
    // Fallback to token ID based logic
    const id = parseInt(nft?.token_id || '0');
    if (id % 3 === 0) return 'High';
    if (id % 3 === 1) return 'Medium';
    return 'Low';
  };

  const severity = nft ? getSeverity() : 'Medium';
  const severityColors = {
    Low: 'text-yellow-500 border-yellow-500 bg-yellow-500/10',
    Medium: 'text-orange-500 border-orange-500 bg-orange-500/10',
    High: 'text-red-500 border-red-500 bg-red-500/10',
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen pt-12 pb-24 px-6 max-w-7xl mx-auto flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-cyan-500 mb-4 inline-block">
            <RefreshCw size={48} />
          </div>
          <p className="text-zinc-400 font-mono text-sm uppercase">Loading issue...</p>
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
            {error || 'Issue Not Found'}
          </h2>
          <p className="text-zinc-400 font-mono text-sm mb-6 uppercase">
            This issue doesn't exist or has been removed.
          </p>
          <Link
            to="/explore"
            className="inline-block px-8 py-3 bg-cyan-500 text-white font-black uppercase hover:bg-cyan-600 transition-colors"
          >
            VIEW PUBLIC LEDGER
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
            
            {/* Permanently Recorded Badge */}
            <div className="absolute top-6 left-6 z-20">
              <div className="flex items-center gap-2 bg-emerald-500/20 backdrop-blur-xl border border-emerald-500/50 px-4 py-2 rounded-xl text-emerald-400">
                <ShieldCheck size={16} fill="currentColor" className="text-emerald-500" />
                <span className="font-mono text-[10px] uppercase font-bold">Permanently Recorded</span>
              </div>
            </div>

            {/* Status Badge */}
            <div className="absolute top-6 right-6 z-20">
              <div className={`flex items-center gap-2 backdrop-blur-xl border px-4 py-2 rounded-xl ${
                issueStatus === 'Resolved' 
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                  : 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
              }`}>
                {issueStatus === 'Resolved' ? (
                  <CheckCircle size={16} fill="currentColor" className="text-emerald-500" />
                ) : (
                  <AlertTriangle size={16} className="text-cyan-500" />
                )}
                <span className="font-mono text-[10px] uppercase font-bold">{issueStatus}</span>
              </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="absolute bottom-6 left-6 flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-xl">
               <span className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_#06b6d4]"></span>
               <span className="font-mono text-[10px] uppercase font-bold tracking-widest">Evidence #{nft.token_id}</span>
            </div>
          </div>

          {/* Blockchain Info */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-black uppercase flex items-center gap-2">
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
                <span className="text-zinc-500">Evidence ID:</span>
                <span className="text-white">#{nft.token_id}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-zinc-500">Chain:</span>
                <span className="text-white">Sepolia ({nft.chain_id})</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-zinc-500">Reported:</span>
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

          {/* Issue Details */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6">
            <h3 className="text-sm font-black uppercase mb-4">Issue Details</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-500">SEVERITY</span>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${severityColors[severity]}`}>
                  <AlertTriangle size={12} />
                  <span className="text-xs font-mono font-bold uppercase">{severity}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-500">STATUS</span>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${
                  issueStatus === 'Resolved'
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500'
                    : 'bg-cyan-500/10 border-cyan-500 text-cyan-500'
                }`}>
                  <span className="w-2 h-2 rounded-full ${issueStatus === 'Resolved' ? 'bg-emerald-500' : 'bg-cyan-500'}"></span>
                  <span className="text-xs font-mono font-bold uppercase">{issueStatus}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Attributes */}
          {nft.attributes && nft.attributes.length > 0 && (
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6">
              <h3 className="text-sm font-black uppercase mb-4">Additional Details</h3>
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
                <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase leading-none">
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
                    <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 p-[1px]">
                      <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center overflow-hidden">
                         <User size={20} className="text-zinc-500" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <p className="text-[10px] text-zinc-500 font-mono">SUBMITTED BY</p>
                      </div>
                      <WalletAddress 
                        address={nft.owner_wallet}
                        showCopyButton={true}
                        className="text-xs font-bold text-cyan-500 font-mono"
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

          {/* Issue Actions */}
          <div className="space-y-4">
            {(() => {
              if (!walletAddress) {
                return (
                  <div className="w-full px-6 py-4 bg-yellow-500/10 border border-yellow-500 text-yellow-500 font-black uppercase text-center">
                    Connect Wallet to Interact
                  </div>
                );
              }
              
              // Check if current user is the submitter
              const isSubmitter = walletAddress && nft && walletAddress.toLowerCase() === nft.owner_wallet.toLowerCase();
              
              if (isSubmitter) {
                if (issueStatus === 'Resolved') {
                  return (
                    <div className="w-full px-6 py-4 bg-emerald-500/10 border-2 border-emerald-500 text-emerald-500 font-black uppercase text-center flex items-center justify-center gap-2">
                      <CheckCircle size={20} fill="currentColor" />
                      ISSUE RESOLVED
                    </div>
                  );
                } else {
                  return (
                    <>
                      {!showCloseConfirm ? (
                        <button
                          onClick={() => setShowCloseConfirm(true)}
                          className="w-full px-6 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase transition-all duration-300 hover:scale-105 active:scale-95"
                        >
                          CLOSE ISSUE (MARK AS RESOLVED)
                        </button>
                      ) : (
                        <div className="space-y-4 p-6 bg-zinc-900 border-2 border-emerald-500 rounded-xl">
                          <h3 className="text-lg font-black text-white uppercase">Confirm Resolution</h3>
                          <p className="text-sm text-zinc-400 font-mono">
                            Are you sure this issue has been resolved? This action will mark the issue as closed.
                          </p>
                          <textarea
                            value={resolutionNotes}
                            onChange={(e) => setResolutionNotes(e.target.value)}
                            placeholder="Optional: Add resolution notes..."
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs font-mono focus:border-emerald-500 outline-none transition-all resize-none"
                            rows={3}
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={handleCloseIssue}
                              disabled={isClosing}
                              className="flex-1 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase disabled:opacity-50 transition-colors"
                            >
                              {isClosing ? 'CLOSING...' : 'CONFIRM'}
                            </button>
                            <button
                              onClick={() => setShowCloseConfirm(false)}
                              disabled={isClosing}
                              className="flex-1 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-black uppercase disabled:opacity-50 transition-colors"
                            >
                              CANCEL
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  );
                }
              } else {
                return (
                  <div className="w-full px-6 py-4 bg-zinc-900 border border-zinc-800 text-zinc-500 font-black uppercase text-center">
                    Only the submitter can close this issue
                  </div>
                );
              }
            })()}
            
            <div className="flex gap-2">
              <button className="flex-1 p-3 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-cyan-500 transition-colors flex items-center justify-center gap-2">
                <Heart size={20} />
                <span className="text-sm font-mono">Support</span>
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

          {/* Back to Public Ledger */}
          <Link
            to="/explore"
            className="block w-full py-4 text-center border-2 border-zinc-800 text-zinc-400 font-black text-lg hover:border-cyan-500 hover:text-cyan-500 transition-all uppercase"
          >
            ← BACK TO PUBLIC LEDGER
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NFTDetail;
