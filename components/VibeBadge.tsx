
import React from 'react';

interface VibeBadgeProps {
  label: string;
  className?: string;
  onClick?: () => void;
}

const VibeBadge: React.FC<VibeBadgeProps> = ({ label, className = "", onClick }) => {
  return (
    <span 
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black italic border transition-all cursor-pointer ${
        label.includes('Chaotic') ? 'bg-pink-500/10 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white shadow-[0_0_10px_rgba(236,72,153,0.2)]' :
        label.includes('Brainrot') ? 'bg-amber-500/10 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white shadow-[0_0_10px_rgba(245,158,11,0.2)]' :
        label.includes('Flex') ? 'bg-indigo-500/10 border-indigo-500 text-indigo-500 hover:bg-indigo-500 hover:text-white shadow-[0_0_10px_rgba(99,102,241,0.2)]' :
        label.includes('Romantic') ? 'bg-violet-500/10 border-violet-500 text-violet-500 hover:bg-violet-500 hover:text-white shadow-[0_0_10px_rgba(139,92,246,0.2)]' :
        'bg-cyan-500/10 border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-white shadow-[0_0_10px_rgba(6,182,212,0.2)]'
      } ${className}`}
    >
      {label.toUpperCase()}
    </span>
  );
};

export default VibeBadge;
