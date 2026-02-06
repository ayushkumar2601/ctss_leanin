
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal, Sparkles, RefreshCw } from 'lucide-react';
import { getAllNFTs } from '../lib/services/nftService';
import type { NFTWithAttributes } from '../lib/supabase/types';
import IssueCard from '../components/NFTCard';
import EmptyState from '../components/EmptyState';

const Explore: React.FC = () => {
  const [issues, setIssues] = useState<NFTWithAttributes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  // Fetch issues from Supabase
  useEffect(() => {
    fetchIssues();
  }, [sortOrder]);

  const fetchIssues = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllNFTs(sortOrder);
      setIssues(data);
    } catch (err: any) {
      console.error('Error fetching issues:', err);
      setError('Failed to load issues. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter issues based on search
  const filteredIssues = useMemo(() => {
    if (!searchQuery) return issues;

    return issues.filter(issue => 
      issue.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      issue.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.attributes?.some(attr => 
        attr.trait_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        attr.value.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [issues, searchQuery]);

  return (
    <div className="px-6 py-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-5xl font-black tracking-tighter mb-4 uppercase">
          Public <span className="text-cyan-500">Ledger</span>
        </h1>
        <div className="h-1 w-24 bg-gradient-to-r from-cyan-500 to-transparent"></div>
      </div>

      {/* Filters Bar */}
      <div className="space-y-6 mb-12">
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input 
              type="text" 
              placeholder="SEARCH BY TITLE, DESCRIPTION, LOCATION..."
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-full py-4 pl-12 pr-6 text-xs font-mono outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
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
                LATEST
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
              onClick={fetchIssues}
              disabled={isLoading}
              className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-cyan-500 transition-colors disabled:opacity-50"
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
          <div className="animate-spin text-cyan-500 mb-4">
            <RefreshCw size={48} />
          </div>
          <p className="font-mono text-sm text-zinc-500 uppercase">Loading public ledger...</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-red-900 rounded-3xl">
          <Sparkles size={48} className="text-red-700 mb-4" />
          <p className="font-mono text-sm text-red-500 uppercase mb-4">{error}</p>
          <button
            onClick={fetchIssues}
            className="px-6 py-3 bg-red-500 text-white font-bold uppercase hover:bg-red-600 transition-colors"
          >
            TRY AGAIN
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredIssues.length === 0 && issues.length === 0 && (
        <EmptyState
          icon="sparkles"
          title="No issues reported yet — be the first to upload evidence 🚀"
          description="The public ledger is waiting for your submission. Start documenting issues!"
          primaryAction={{ label: 'Upload Evidence', to: '/mint' }}
          secondaryAction={{ label: 'Refresh', to: '/explore' }}
        />
      )}

      {/* No Search Results */}
      {!isLoading && !error && filteredIssues.length === 0 && issues.length > 0 && (
        <EmptyState
          icon="search"
          title="No results found"
          description={`No issues match "${searchQuery}". Try a different search term.`}
          primaryAction={{ label: 'Clear Search', to: '/explore' }}
          secondaryAction={{ label: 'Upload Evidence', to: '/mint' }}
        />
      )}

      {/* Grid */}
      {!isLoading && !error && filteredIssues.length > 0 && (
        <>
          <div className="mb-6 flex justify-between items-center">
            <p className="text-sm font-mono text-zinc-500">
              {filteredIssues.length} ISSUE{filteredIssues.length !== 1 ? 'S' : ''} FOUND
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredIssues.map(issue => (
              <IssueCard key={issue.id} nft={issue} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Explore;
