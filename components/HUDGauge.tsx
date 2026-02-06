
import React from 'react';
import { Info, Target } from 'lucide-react';

interface HUDGaugeProps {
  value: number; // 0-100
  demand: 'Low' | 'Medium' | 'High';
}

const HUDGauge: React.FC<HUDGaugeProps> = ({ value, demand }) => {
  const getColor = () => {
    if (value > 80) return '#06b6d4'; // cyan
    if (value > 50) return '#ec4899'; // pink
    return '#facc15'; // yellow
  };

  return (
    <div className="relative p-6 bg-black/40 border border-white/5 rounded-3xl overflow-hidden group">
      {/* HUD Scanner Animation */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50 animate-pulse"></div>
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <h4 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-1 group-hover:text-white transition-colors">
            AI CONFIDENCE 
            <span title="Calculated using similar NFT sales, artist momentum, and market trends">
              <Info size={10} className="cursor-help" />
            </span>
          </h4>
          <div className="text-4xl font-black italic tracking-tighter transition-all duration-700" style={{ color: getColor(), textShadow: `0 0 15px ${getColor()}44` }}>
            {value}%
          </div>
        </div>
        <div className="text-right">
          <h4 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex items-center justify-end gap-1">
            <Target size={10} /> DEMAND
          </h4>
          <div className={`text-xs font-black italic px-2 py-1 rounded mt-1 inline-block animate-pulse ${
            demand === 'High' ? 'bg-emerald-500/20 text-emerald-400' :
            demand === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
            'bg-red-500/20 text-red-400'
          }`}>
            {demand.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Progress Bar HUD */}
      <div className="relative h-2 bg-zinc-900 rounded-full overflow-hidden border border-white/5">
        <div 
          className="absolute h-full transition-all duration-1000 ease-out"
          style={{ 
            width: `${value}%`, 
            backgroundColor: getColor(),
            boxShadow: `0 0 15px ${getColor()}` 
          }}
        ></div>
        {/* HUD Tick Marks */}
        <div className="absolute inset-0 flex justify-between px-1 opacity-20">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="w-[1px] h-full bg-white"></div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex justify-between text-[8px] font-mono text-zinc-600 uppercase tracking-widest">
        <span>EST_PRECISION_DELTA</span>
        <span className="text-zinc-400">± 1.2%</span>
      </div>

      {/* Futuristic Corners */}
      <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-white/20"></div>
      <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-white/20"></div>
      <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-white/20"></div>
      <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-white/20"></div>
    </div>
  );
};

export default HUDGauge;
