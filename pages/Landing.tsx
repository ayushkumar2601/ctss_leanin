
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Eye, FileText, Play, RefreshCw } from 'lucide-react';
import IssueCard from '../components/NFTCard';
import { getTrendingNFTs } from '../lib/services/nftService';
import type { NFTWithAttributes } from '../lib/supabase/types';

const Landing: React.FC = () => {
  const [scrollPos, setScrollPos] = useState(0);
  const [trendingIssues, setTrendingIssues] = useState<NFTWithAttributes[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => setScrollPos(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetchTrendingIssues();
  }, []);

  const fetchTrendingIssues = async () => {
    setIsLoading(true);
    try {
      const issues = await getTrendingNFTs(6);
      setTrendingIssues(issues);
    } catch (error) {
      console.error('Error fetching trending issues:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background Decors */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[150px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[150px] -z-10 animate-pulse delay-1000"></div>

      {/* Hero Section */}
      <section className="relative px-6 pt-20 pb-32 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-[10px] font-mono tracking-widest text-zinc-500 mb-8">
          <span className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_#06b6d4]"></span>
          PUBLIC LEDGER ACTIVE
        </div>

        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.85] mb-8 uppercase">
          CT<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-teal-500 to-cyan-500 block md:inline">sync</span><br />
          <span className="relative text-5xl md:text-7xl lg:text-8xl">PUBLIC ISSUE EVIDENCE LEDGER<span className="absolute -bottom-2 left-0 w-full h-2 bg-cyan-500/30 blur-md"></span></span>
        </h1>

        <p className="max-w-2xl text-zinc-400 font-mono text-sm md:text-base leading-relaxed mb-12 uppercase tracking-wide">
          A transparent, visual board of real-world issues.
          Upload evidence. Make issues visible. Enforce accountability.
        </p>

        <div className="flex flex-col sm:flex-row gap-6">
          <Link 
            to="/mint" 
            className="group relative px-10 py-5 bg-white text-black font-black text-lg hover:bg-cyan-500 hover:text-white transition-all duration-300"
          >
            <span className="inline-block">UPLOAD EVIDENCE</span>
            <div className="absolute -inset-1 border border-cyan-500 scale-105 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
          </Link>
          <Link 
            to="/explore" 
            className="group flex items-center gap-3 px-10 py-5 border-2 border-white/10 text-white font-black text-lg hover:border-cyan-500 transition-all duration-300"
          >
            <span className="inline-block flex items-center gap-2">
              VIEW PUBLIC LEDGER <ArrowRight size={20} />
            </span>
          </Link>
        </div>

        {/* Floating Cards Mockup (Parallax effect) */}
        {trendingIssues.length >= 2 && (
          <>
            <div className="hidden lg:block absolute top-40 -left-20 w-64 rotate-[-15deg]" style={{ transform: `translateY(${scrollPos * -0.1}px) rotate(-15deg)` }}>
              <IssueCard nft={trendingIssues[0]} />
            </div>
            <div className="hidden lg:block absolute bottom-0 -right-20 w-64 rotate-[12deg]" style={{ transform: `translateY(${scrollPos * 0.15}px) rotate(12deg)` }}>
              <IssueCard nft={trendingIssues[1]} />
            </div>
          </>
        )}
      </section>

      {/* Stats Section */}
      <section className="bg-zinc-900/50 border-y border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'ISSUES REPORTED', val: '2,400+' },
            { label: 'RESOLVED', val: '1,200+' },
            { label: 'ACTIVE USERS', val: '500+' },
            { label: 'TRANSPARENCY', val: '100%' },
          ].map((stat, i) => (
            <div key={i} className="text-center group">
              <p className="text-zinc-500 font-mono text-[10px] mb-1 group-hover:text-cyan-500 transition-colors uppercase">{stat.label}</p>
              <p className="text-3xl font-black text-white">{stat.val}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-black tracking-tighter uppercase">Recent <span className="text-cyan-500">Reports</span></h2>
            <p className="text-zinc-500 font-mono text-xs uppercase mt-2">Latest issues submitted to the public ledger</p>
          </div>
          <Link to="/explore" className="text-sm font-bold text-zinc-400 hover:text-white flex items-center gap-2 font-mono">
            VIEW ALL <ArrowRight size={14} />
          </Link>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-zinc-900 rounded-2xl mb-4"></div>
                <div className="h-4 bg-zinc-900 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-zinc-900 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        )}

        {/* Issue Grid */}
        {!isLoading && trendingIssues.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {trendingIssues.map(issue => (
              <IssueCard key={issue.id} nft={issue} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && trendingIssues.length === 0 && (
          <div className="text-center py-16 border-2 border-dashed border-zinc-900 rounded-3xl">
            <p className="text-zinc-500 font-mono text-sm uppercase mb-4">No issues reported yet</p>
            <Link 
              to="/mint"
              className="inline-block px-8 py-3 bg-cyan-500 text-white font-black uppercase hover:bg-cyan-600 transition-colors"
            >
              BE THE FIRST TO REPORT
            </Link>
          </div>
        )}
      </section>

      {/* Benefits / Features */}
      <section className="py-24 px-6 bg-[#080808]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4 group">
            <div className="w-12 h-12 bg-cyan-500/10 flex items-center justify-center rounded-xl text-cyan-500 group-hover:bg-cyan-500 group-hover:text-black transition-all">
              <Eye size={24} />
            </div>
            <h3 className="text-xl font-black uppercase">Public Visibility</h3>
            <p className="text-zinc-500 font-mono text-xs leading-relaxed uppercase">Every issue is permanently recorded on the blockchain. No deletion. No censorship.</p>
          </div>
          <div className="space-y-4 group">
            <div className="w-12 h-12 bg-teal-500/10 flex items-center justify-center rounded-xl text-teal-500 group-hover:bg-teal-500 group-hover:text-black transition-all">
              <FileText size={24} />
            </div>
            <h3 className="text-xl font-black uppercase">Evidence-Based</h3>
            <p className="text-zinc-500 font-mono text-xs leading-relaxed uppercase">AI-powered analysis of uploaded evidence with confidence scoring and severity assessment.</p>
          </div>
          <div className="space-y-4 group">
            <div className="w-12 h-12 bg-cyan-500/10 flex items-center justify-center rounded-xl text-cyan-500 group-hover:bg-cyan-500 group-hover:text-black transition-all">
              <Shield size={24} />
            </div>
            <h3 className="text-xl font-black uppercase">Accountability</h3>
            <p className="text-zinc-500 font-mono text-xs leading-relaxed uppercase">Transparent status tracking from report to resolution. Hold institutions accountable.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto rounded-[3rem] bg-gradient-to-br from-zinc-900 to-black p-12 md:p-20 border border-white/5 relative overflow-hidden text-center">
           <div className="absolute inset-0 bg-grid-white/[0.02] -z-10"></div>
           <h2 className="text-4xl md:text-6xl font-black uppercase mb-8 leading-tight">
             READY TO <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-500">EXPOSE</span> THE TRUTH?
           </h2>
           <Link to="/mint" className="inline-flex items-center gap-4 bg-cyan-500 text-black px-12 py-6 font-black text-xl hover:bg-white transition-colors uppercase">
             Upload Evidence Now <Play size={24} fill="currentColor" />
           </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;
