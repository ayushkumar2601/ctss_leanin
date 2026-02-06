import React from 'react';
import { useWallet } from '../contexts/WalletContext';
import { useUserNFTs } from '../hooks/useUserNFTs';
import IssueCard from '../components/NFTCard';
import EmptyState from '../components/EmptyState';
import WalletAddress from '../components/WalletAddress';
import { Wallet, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { walletAddress, walletType } = useWallet();
  const { nfts, isLoading, error, refetch } = useUserNFTs(walletAddress);

  // Not connected state
  if (!walletAddress) {
    return (
      <div className="min-h-screen bg-[#050505] pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="w-20 h-20 rounded-full bg-zinc-900 border-2 border-zinc-800 flex items-center justify-center mb-6">
              <Wallet size={32} className="text-zinc-600" />
            </div>
            <h2 className="text-3xl font-black text-white mb-3">
              CONNECT YOUR WALLET
            </h2>
            <p className="text-zinc-400 font-mono text-sm max-w-md">
              Connect your wallet to view your submitted evidence
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="animate-spin text-cyan-500 mb-4">
              <RefreshCw size={48} />
            </div>
            <p className="text-zinc-400 font-mono text-sm">
              LOADING YOUR SUBMISSIONS...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#050505] pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="w-20 h-20 rounded-full bg-red-500/10 border-2 border-red-500 flex items-center justify-center mb-6">
              <AlertCircle size={32} className="text-red-500" />
            </div>
            <h2 className="text-2xl font-black text-white mb-3">
              FAILED TO LOAD SUBMISSIONS
            </h2>
            <p className="text-zinc-400 font-mono text-sm mb-6 max-w-md">
              {error}
            </p>
            <button
              onClick={() => refetch()}
              className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 font-bold uppercase transition-colors"
            >
              <RefreshCw size={16} />
              TRY AGAIN
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (nfts.length === 0) {
    return (
      <div className="min-h-screen bg-[#050505] pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl font-black tracking-tighter mb-4">
              <span className="text-white">MY</span>{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-teal-500">
                SUBMISSIONS
              </span>
            </h1>
            <div className="flex items-center gap-3 text-sm font-mono">
              <span className="text-zinc-500">WALLET:</span>
              <WalletAddress 
                address={walletAddress}
                showCopyButton={true}
                className="text-cyan-500"
              />
              <span className="text-zinc-700">|</span>
              <span className="text-zinc-500 uppercase">{walletType}</span>
            </div>
          </div>

          {/* Empty State */}
          <EmptyState
            icon="sparkles"
            title="No submissions yet — upload your first evidence 🚀"
            description="You haven't submitted any evidence yet. Start documenting issues!"
            primaryAction={{ label: 'Upload Evidence', to: '/mint' }}
            secondaryAction={{ label: 'View Public Ledger', to: '/explore' }}
          />
        </div>
      </div>
    );
  }

  // Issue Grid
  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-5xl font-black tracking-tighter mb-4">
              <span className="text-white">MY</span>{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-teal-500">
                SUBMISSIONS
              </span>
            </h1>
            <div className="flex items-center gap-3 text-sm font-mono">
              <span className="text-zinc-500">WALLET:</span>
              <WalletAddress 
                address={walletAddress}
                showCopyButton={true}
                className="text-cyan-500"
              />
              <span className="text-zinc-700">|</span>
              <span className="text-zinc-500 uppercase">{walletType}</span>
              <span className="text-zinc-700">|</span>
              <span className="text-white font-bold">{nfts.length} SUBMISSION{nfts.length !== 1 ? 'S' : ''}</span>
            </div>
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 bg-zinc-900 hover:bg-cyan-500 border border-zinc-800 hover:border-cyan-500 text-white px-6 py-3 font-bold uppercase transition-all"
          >
            <RefreshCw size={16} />
            REFRESH
          </button>
        </div>

        {/* Issue Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {nfts.map((nft) => (
            <IssueCard key={nft.id} nft={nft} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
