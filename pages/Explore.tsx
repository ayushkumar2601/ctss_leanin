
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal, Sparkles, RefreshCw } from 'lucide-react';
import { getAllNFTs } from '../lib/services/nftService';
import type { NFTWithAttributes } from '../lib/supabase/types';
import NFTCard from '../components/NFTCard';
import EmptyState from '../components/EmptyState';

const Explore: React.FC = () => {
  const [nfts, setNfts] = useState<NFTWithAttributes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  // Fetch NFTs from Supabase
  useEffect(() => {
    fetchNFTs();
  }, [sortOrder]);

  const fetchNFTs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllNFTs(sortOrder);
      setNfts(data);
    } catch (err: any) {
      console.error('Error fetching NFTs:', err);
      setError('Failed to load NFTs. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter NFTs based on search
  const filteredNFTs = useMemo(() => {
    if (!searchQuery) return nfts;

    return nfts.filter(nft => 
      nft.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      nft.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nft.attributes?.some(attr => 
        attr.trait_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        attr.value.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [nfts, searchQuery]);

  return (
    <div className="px-6 py-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-5xl font-black italic uppercase tracking-tighter mb-4">
          Explore the <span className="text-pink-500">Void</span>
        </h1>
        <div className="h-1 w-24 bg-gradient-to-r from-pink-500 to-transparent"></div>
      </div>

      {/* Filters Bar */}
      <div className="space-y-6 mb-12">
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input 
              type="text" 
              placeholder="SEARCH BY NAME, DESCRIPTION, ATTRIBUTES..."
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-full py-4 pl-12 pr-6 text-xs font-mono outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-4 items-center">
            <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg p-1">
              <button 
                onClick={() => setSortOrder('newest')}
                className={`px-4 py-2 rounded text-xs font-mono transition-colors ${
                  sortOrder === 'newest' ? 'bg-zinc-800 text-white' : 'text-zinc-500'
                }`}
              >
                NEWEST
              </button>
              <button 
                onClick={() => setSortOrder('oldest')}
                className={`px-4 py-2 rounded text-xs font-mono transition-colors ${
                  sortOrder === 'oldest' ? 'bg-zinc-800 text-white' : 'text-zinc-500'
                }`}
              >
                OLDEST
              </button>
            </div>
            
            <button
              onClick={fetchNFTs}
              disabled={isLoading}
              className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-pink-500 transition-colors disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-32">
          <div className="animate-spin text-pink-500 mb-4">
            <RefreshCw size={48} />
          </div>
          <p className="font-mono text-sm text-zinc-500 uppercase">Loading NFTs...</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-red-900 rounded-3xl">
          <Sparkles size={48} className="text-red-700 mb-4" />
          <p className="font-mono text-sm text-red-500 uppercase mb-4">{error}</p>
          <button
            onClick={fetchNFTs}
            className="px-6 py-3 bg-red-500 text-white font-bold uppercase hover:bg-red-600 transition-colors"
          >
            TRY AGAIN
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredNFTs.length === 0 && nfts.length === 0 && (
        <EmptyState
          icon="sparkles"
          title="No NFTs yet — mint your first Voxrt asset 🚀"
          description="The marketplace is waiting for creators like you. Be the first to mint!"
          primaryAction={{ label: 'Mint NFT', to: '/mint' }}
          secondaryAction={{ label: 'Refresh', to: '/explore' }}
        />
      )}

      {/* No Search Results */}
      {!isLoading && !error && filteredNFTs.length === 0 && nfts.length > 0 && (
        <EmptyState
          icon="search"
          title="No results found"
          description={`No NFTs match "${searchQuery}". Try a different search term.`}
          primaryAction={{ label: 'Clear Search', to: '/explore' }}
          secondaryAction={{ label: 'Mint NFT', to: '/mint' }}
        />
      )}

      {/* Grid */}
      {!isLoading && !error && filteredNFTs.length > 0 && (
        <>
          <div className="mb-6 flex justify-between items-center">
            <p className="text-sm font-mono text-zinc-500">
              {filteredNFTs.length} NFT{filteredNFTs.length !== 1 ? 'S' : ''} FOUND
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredNFTs.map(nft => (
              <NFTCard key={nft.id} nft={nft} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Explore;
