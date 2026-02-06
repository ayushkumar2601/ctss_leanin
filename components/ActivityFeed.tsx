
import React, { useState, useEffect } from 'react';
import { Zap, ShoppingBag, Plus, X, Activity, Globe } from 'lucide-react';
import { MOCK_ACTIVITY } from '../constants';

const ActivityFeed: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [events, setEvents] = useState(MOCK_ACTIVITY);

  if (!isVisible) return (
    <button 
      onClick={() => setIsVisible(true)}
      className="fixed bottom-6 right-6 z-[200] w-12 h-12 bg-zinc-900 border border-white/10 rounded-full flex items-center justify-center text-pink-500 hover:scale-110 transition-all shadow-[0_0_20px_rgba(236,72,153,0.3)]"
    >
      <Activity size={20} />
    </button>
  );

  return (
    <div className="fixed bottom-6 right-6 z-[200] w-72 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-in slide-in-from-right duration-500">
      <div className="flex justify-between items-center p-4 border-b border-white/5 bg-zinc-900/50">
        <div className="flex flex-col">
           <h3 className="text-[10px] font-black italic uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Live Activity
          </h3>
          <div className="flex items-center gap-1 mt-1 opacity-50">
            <Globe size={8} />
            <span className="text-[7px] font-mono uppercase">On-chain Visualizer</span>
          </div>
        </div>
        <button onClick={() => setIsVisible(false)} className="text-zinc-500 hover:text-white">
          <X size={14} />
        </button>
      </div>

      {/* On-Chain Activity Visualizer Widget */}
      <div className="h-16 bg-black/40 border-b border-white/5 relative flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(236,72,153,0.1)_0%,_transparent_70%)]"></div>
        <div className="flex gap-2 relative">
          {[...Array(8)].map((_, i) => (
            <div 
              key={i} 
              className="w-1.5 h-1.5 rounded-full bg-pink-500/40 animate-pulse"
              style={{ animationDelay: `${i * 0.2}s`, opacity: Math.random() }}
            ></div>
          ))}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[6px] font-mono text-pink-500 animate-bounce">ETH_TX</div>
        </div>
      </div>

      <div className="max-h-64 overflow-y-auto custom-scrollbar p-2 space-y-2">
        {events.map((event) => (
          <div key={event.id} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-start gap-3 hover:bg-white/10 transition-colors group">
            <div className={`mt-0.5 p-1.5 rounded-lg ${
              event.type === 'SALE' ? 'bg-pink-500/20 text-pink-500' : 
              event.type === 'MINT' ? 'bg-cyan-500/20 text-cyan-500' : 
              'bg-violet-500/20 text-violet-500'
            }`}>
              {event.type === 'SALE' ? <ShoppingBag size={12} /> : 
               event.type === 'MINT' ? <Plus size={12} /> : 
               <Zap size={12} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-mono text-zinc-400 truncate">
                <span className="text-white font-bold">@{event.user}</span> {event.type.toLowerCase()}ed
              </p>
              <p className="text-[10px] font-black italic uppercase text-zinc-200 truncate group-hover:text-pink-500">
                {event.nftTitle}
              </p>
              <div className="flex justify-between items-center mt-1">
                {event.price && <span className="text-[9px] font-mono text-emerald-400">{event.price} ETH</span>}
                <span className="text-[8px] font-mono text-zinc-600">{event.timestamp} ago</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;
