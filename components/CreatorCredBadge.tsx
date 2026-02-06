
import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

interface CreatorCredBadgeProps {
  score: number;
}

const CreatorCredBadge: React.FC<CreatorCredBadgeProps> = ({ score }) => {
  const getLevel = () => {
    if (score > 90) return { label: 'ELITE', color: '#10b981', ring: 'shadow-[0_0_15px_#10b981]' };
    if (score > 70) return { label: 'VETTED', color: '#06b6d4', ring: 'shadow-[0_0_15px_#06b6d4]' };
    return { label: 'RISING', color: '#facc15', ring: 'shadow-[0_0_15px_#facc15]' };
  };

  const level = getLevel();

  return (
    <div className="relative group inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-white/10 rounded-xl cursor-help transition-all hover:border-white/20">
      <div className={`w-2 h-2 rounded-full ${level.ring}`} style={{ backgroundColor: level.color }}></div>
      <span className="text-[10px] font-black italic tracking-widest uppercase" style={{ color: level.color }}>
        CRED: {level.label}
      </span>
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-4 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-2xl">
        <h5 className="text-[10px] font-black italic uppercase text-zinc-400 mb-2 flex items-center gap-1">
          <ShieldCheck size={12} /> Creator Score: {score}
        </h5>
        <div className="space-y-1">
          <div className="flex justify-between text-[8px] font-mono text-zinc-500">
            <span>PAST SALES</span>
            <span className="text-white">TOP 5%</span>
          </div>
          <div className="flex justify-between text-[8px] font-mono text-zinc-500">
            <span>HOLD TIME</span>
            <span className="text-white">124 DAYS AVG</span>
          </div>
          <div className="flex justify-between text-[8px] font-mono text-zinc-500">
            <span>ENGAGEMENT</span>
            <span className="text-white">HIGH</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorCredBadge;
