import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Search, ShoppingBag } from 'lucide-react';

interface EmptyStateProps {
  icon?: 'sparkles' | 'search' | 'shopping';
  title?: string;
  description?: string;
  primaryAction?: {
    label: string;
    to: string;
  };
  secondaryAction?: {
    label: string;
    to: string;
  };
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'sparkles',
  title = 'No evidence yet — upload your first issue 🚀',
  description = 'Your submissions will appear here once you upload evidence.',
  primaryAction = { label: 'Upload Evidence', to: '/mint' },
  secondaryAction = { label: 'Explore NFTs', to: '/explore' },
}) => {
  const getIcon = () => {
    switch (icon) {
      case 'search':
        return <Search size={48} className="text-zinc-700" />;
      case 'shopping':
        return <ShoppingBag size={48} className="text-zinc-700" />;
      default:
        return <Sparkles size={48} className="text-zinc-700" />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {/* Icon */}
      <div className="mb-6 opacity-50">
        {getIcon()}
      </div>

      {/* Title */}
      <h3 className="text-xl md:text-2xl font-black italic text-white mb-3 max-w-md">
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="text-sm text-zinc-500 font-mono mb-8 max-w-md leading-relaxed">
          {description}
        </p>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        {primaryAction && (
          <Link
            to={primaryAction.to}
            className="px-8 py-3 bg-pink-500 hover:bg-pink-600 text-white font-black uppercase text-sm transition-colors"
          >
            {primaryAction.label}
          </Link>
        )}
        {secondaryAction && (
          <Link
            to={secondaryAction.to}
            className="px-8 py-3 border-2 border-zinc-800 hover:border-pink-500 text-white font-black uppercase text-sm transition-colors"
          >
            {secondaryAction.label}
          </Link>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
