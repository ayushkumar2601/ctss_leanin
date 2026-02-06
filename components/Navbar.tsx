
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Wallet, PlusCircle, LayoutGrid, LogOut, AlertCircle } from 'lucide-react';
import { useWallet, SEPOLIA_CHAIN_ID } from '../contexts/WalletContext';
import WalletModal from './WalletModal';
import WalletAddress from './WalletAddress';

const Navbar: React.FC = () => {
  const { walletAddress, walletType, chainId, disconnectWallet } = useWallet();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [showWalletDropdown, setShowWalletDropdown] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const location = useLocation();

  const isWrongNetwork = chainId && chainId !== SEPOLIA_CHAIN_ID;
  const walletConnected = !!walletAddress;

  const shortenAddress = (address: string | null) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getWalletEmoji = () => {
    if (walletType === 'metamask') return '🦊';
    if (walletType === 'phantom') return '👻';
    return '💼';
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showWalletDropdown) {
        const target = event.target as HTMLElement;
        if (!target.closest('.wallet-dropdown-container')) {
          setShowWalletDropdown(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showWalletDropdown]);

  const handleLogoClick = (e: React.MouseEvent) => {
    // Clear last visited page when clicking logo
    try {
      localStorage.removeItem('voxrt_last_page');
    } catch (error) {
      // Silently fail
    }
    
    const newCount = logoClicks + 1;
    setLogoClicks(newCount);
    
    if (newCount >= 5) {
      document.body.classList.add('animate-glitch');
      const audio = new Audio('https://www.soundjay.com/buttons/sounds/button-10.mp3');
      audio.volume = 0.2;
      audio.play().catch(() => {});
      
      setTimeout(() => {
        document.body.classList.remove('animate-glitch');
        setLogoClicks(0);
      }, 3000);
    }
  };

  const navLinks = [
    { name: 'EXPLORE', path: '/explore', icon: <LayoutGrid size={16} /> },
    { name: 'MINT', path: '/mint', icon: <PlusCircle size={16} /> },
    { name: 'DASHBOARD', path: '/dashboard', icon: <Wallet size={16} /> },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo with Easter Egg */}
          <Link to="/" onClick={handleLogoClick} className="group relative flex items-center space-x-2 select-none">
            <span className={`text-3xl font-black italic tracking-tighter text-white group-hover:text-pink-500 transition-colors ${logoClicks > 0 ? 'animate-pulse' : ''}`}>
              VOX<span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">RT</span>
            </span>
            <div className="absolute -bottom-1 left-0 w-0 h-[2px] bg-pink-500 group-hover:w-full transition-all duration-300"></div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8 font-mono text-xs font-bold">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path}
                className={`flex items-center space-x-2 transition-all duration-200 hover:scale-110 ${
                  location.pathname === link.path ? 'text-pink-500' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}
            
            <div className="h-6 w-[1px] bg-zinc-800"></div>

            {walletConnected ? (
              <div className="relative wallet-dropdown-container">
                <button 
                  onClick={() => setShowWalletDropdown(!showWalletDropdown)}
                  className={`flex items-center space-x-2 px-6 py-2 rounded-full border-2 transition-all duration-300 active:scale-95 ${
                    isWrongNetwork
                      ? 'border-yellow-500 text-yellow-500 bg-yellow-500/10 animate-pulse'
                      : 'border-emerald-500 text-emerald-500 bg-emerald-500/10'
                  }`}
                >
                  <span className="text-base">{getWalletEmoji()}</span>
                  {walletAddress && (
                    <WalletAddress 
                      address={walletAddress} 
                      showCopyButton={false}
                      className="text-emerald-500"
                    />
                  )}
                  {isWrongNetwork && <AlertCircle size={14} />}
                </button>

                {showWalletDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-zinc-900 border-2 border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.3)] p-4 z-[110]">
                    <div className="space-y-3">
                      <div className="pb-3 border-b border-zinc-800">
                        <p className="text-[10px] font-mono text-zinc-500 uppercase mb-1">Connected Wallet</p>
                        {walletAddress && (
                          <WalletAddress 
                            address={walletAddress}
                            showCopyButton={true}
                            className="text-xs font-mono text-white"
                            maxLength={42}
                          />
                        )}
                        <p className="text-[10px] font-mono text-zinc-500 mt-1 uppercase">
                          {walletType} {getWalletEmoji()}
                        </p>
                      </div>
                      
                      {isWrongNetwork && (
                        <div className="p-2 bg-yellow-500/10 border border-yellow-500 text-yellow-400 text-[10px] font-mono">
                          ⚠️ WRONG NETWORK
                        </div>
                      )}

                      <button
                        onClick={() => {
                          disconnectWallet();
                          setShowWalletDropdown(false);
                        }}
                        className="w-full flex items-center justify-center gap-2 bg-red-500/20 border border-red-500 text-red-400 py-2 px-4 text-xs font-bold uppercase hover:bg-red-500/30 transition-colors"
                      >
                        <LogOut size={14} />
                        DISCONNECT
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={() => {
                  setIsWalletModalOpen(true);
                  setShowWalletDropdown(false); // Close dropdown when opening modal
                }}
                className="flex items-center space-x-2 px-6 py-2 rounded-full border-2 border-white text-black bg-white hover:bg-transparent hover:text-white transition-all duration-300 active:scale-95"
              >
                <Wallet size={16} />
                <span>CONNECT WALLET</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white p-2">
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-black/95 border-b border-white/10 p-6 font-mono text-sm animate-in slide-in-from-top duration-300">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center space-x-3 text-zinc-400 hover:text-pink-500 py-2"
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}
            {walletConnected ? (
              <div className="space-y-3 pt-3 border-t border-zinc-800">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500 rounded">
                  <p className="text-[10px] font-mono text-zinc-500 uppercase mb-1">Connected</p>
                  {walletAddress && (
                    <WalletAddress 
                      address={walletAddress}
                      showCopyButton={true}
                      className="text-xs font-mono text-emerald-400"
                    />
                  )}
                  <p className="text-[10px] font-mono text-zinc-500 mt-1">{walletType} {getWalletEmoji()}</p>
                </div>
                <button
                  onClick={() => {
                    disconnectWallet();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-red-500/20 border border-red-500 text-red-400 py-3 px-4 text-xs font-bold uppercase"
                >
                  <LogOut size={14} />
                  DISCONNECT
                </button>
              </div>
            ) : (
              <button 
                onClick={() => {
                  setIsWalletModalOpen(true);
                  setIsMenuOpen(false);
                }}
                className="flex items-center space-x-2 px-6 py-4 rounded-xl bg-white text-black font-bold text-center justify-center"
              >
                <Wallet size={18} />
                <span>CONNECT WALLET</span>
              </button>
            )}
          </div>
        </div>
      )}

      <WalletModal isOpen={isWalletModalOpen} onClose={() => setIsWalletModalOpen(false)} />
    </nav>
  );
};

export default Navbar;
