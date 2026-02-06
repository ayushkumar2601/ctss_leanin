import React from 'react';
import { useWallet, SEPOLIA_CHAIN_ID } from '../contexts/WalletContext';
import { X, Wallet, AlertCircle } from 'lucide-react';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {
  const { 
    connectMetaMask, 
    connectPhantom, 
    isConnecting, 
    error,
    chainId,
    switchToSepolia 
  } = useWallet();

  // Handle ESC key press
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isWrongNetwork = chainId && chainId !== SEPOLIA_CHAIN_ID;

  const handleConnect = async (type: 'metamask' | 'phantom') => {
    if (type === 'metamask') {
      await connectMetaMask();
    } else {
      await connectPhantom();
    }
    if (!error) {
      setTimeout(onClose, 500);
    }
  };

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
      onClick={handleBackdropClick}
    >
      <div 
        className="relative w-full max-w-md bg-zinc-900 border-2 border-pink-500 shadow-[0_0_30px_rgba(236,72,153,0.3)] p-6 mx-auto my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <Wallet className="text-pink-500" size={24} />
          <h2 className="text-xl font-black uppercase tracking-tight">
            CONNECT WALLET
          </h2>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500 text-red-400 text-xs font-mono flex items-start gap-2">
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {isWrongNetwork && (
          <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500 text-yellow-400 text-xs font-mono">
            <div className="flex items-start gap-2 mb-2">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span>WRONG NETWORK. SWITCH TO SEPOLIA TESTNET.</span>
            </div>
            <button
              onClick={switchToSepolia}
              className="w-full mt-2 bg-yellow-500 text-black font-bold py-2 px-4 text-xs uppercase hover:bg-yellow-400 transition-colors"
            >
              SWITCH TO SEPOLIA
            </button>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => handleConnect('metamask')}
            disabled={isConnecting}
            className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-black py-4 px-6 text-sm uppercase tracking-wide hover:shadow-[0_0_20px_rgba(251,146,60,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between group"
          >
            <span>METAMASK</span>
            <span className="text-2xl group-hover:scale-110 transition-transform">🦊</span>
          </button>

          <button
            onClick={() => handleConnect('phantom')}
            disabled={isConnecting}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black py-4 px-6 text-sm uppercase tracking-wide hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between group"
          >
            <span>PHANTOM</span>
            <span className="text-2xl group-hover:scale-110 transition-transform">👻</span>
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-zinc-800">
          <p className="text-[10px] font-mono text-zinc-500 text-center leading-relaxed">
            DON'T HAVE A WALLET?{' '}
            <a
              href="https://metamask.io/download/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-500 hover:text-pink-400 underline"
            >
              GET METAMASK
            </a>
            {' OR '}
            <a
              href="https://phantom.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-500 hover:text-purple-400 underline"
            >
              GET PHANTOM
            </a>
          </p>
        </div>

        {isConnecting && (
          <div className="mt-4 text-center">
            <div className="inline-block animate-spin text-pink-500">⚡</div>
            <p className="text-xs font-mono text-zinc-400 mt-2">CONNECTING...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletModal;
