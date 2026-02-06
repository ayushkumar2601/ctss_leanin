# 🦊👻 Ethereum Wallet Integration Guide

## Overview
Complete Ethereum wallet connection system for NEON CHAOS NFT Marketplace supporting MetaMask and Phantom wallets on Sepolia testnet.

## ✅ Features Implemented

### Supported Wallets
- **MetaMask** - Most popular Ethereum wallet
- **Phantom** - Multi-chain wallet (Ethereum mode)

### Core Functionality
- ✅ Wallet detection and connection
- ✅ Network validation (Sepolia testnet)
- ✅ Auto-reconnection on page reload
- ✅ Account change detection
- ✅ Network change detection
- ✅ Persistent wallet state (localStorage)
- ✅ Clean disconnect flow
- ✅ Error handling with Gen-Z friendly messages
- ✅ Mobile responsive UI

## 🏗️ Architecture

### Files Created
```
contexts/
  └── WalletContext.tsx       # Wallet state management & Ethers.js integration

components/
  └── WalletModal.tsx         # Wallet selection modal
  └── Navbar.tsx              # Updated with wallet UI

utils/
  └── walletHelpers.ts        # Utility functions

types.d.ts                    # TypeScript definitions for window.ethereum
```

### Tech Stack
- **Ethers.js v6** - Ethereum library
- **React Context API** - State management
- **localStorage** - Persistence
- **Sepolia Testnet** - Default network

## 🚀 Usage

### Basic Usage
```tsx
import { useWallet } from './contexts/WalletContext';

function MyComponent() {
  const { 
    walletAddress,      // Connected address or null
    walletType,         // 'metamask' | 'phantom' | null
    provider,           // Ethers.js BrowserProvider
    signer,             // Ethers.js Signer
    chainId,            // Current chain ID
    connectMetaMask,    // Connect MetaMask
    connectPhantom,     // Connect Phantom
    disconnectWallet,   // Disconnect wallet
    switchToSepolia     // Switch to Sepolia network
  } = useWallet();

  return (
    <div>
      {walletAddress ? (
        <p>Connected: {walletAddress}</p>
      ) : (
        <button onClick={connectMetaMask}>Connect</button>
      )}
    </div>
  );
}
```

### Making Contract Calls (Future)
```tsx
const { signer, provider } = useWallet();

// Read contract
const contract = new Contract(address, abi, provider);
const data = await contract.someReadFunction();

// Write contract (requires signer)
const contractWithSigner = new Contract(address, abi, signer);
const tx = await contractWithSigner.someWriteFunction();
await tx.wait();
```

## 🔧 Configuration

### Environment Variables
Add to `.env.local`:
```bash
VITE_CHAIN_ID=11155111
VITE_CHAIN_NAME=Sepolia
VITE_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
```

### Network Configuration
Default network is **Sepolia Testnet** (Chain ID: 11155111)

To change networks, update `SEPOLIA_CHAIN_ID` and `SEPOLIA_PARAMS` in `contexts/WalletContext.tsx`.

## 🎨 UI Components

### Navbar Wallet Button
- **Disconnected**: White "CONNECT WALLET" button
- **Connected**: Green badge with shortened address + wallet emoji
- **Wrong Network**: Yellow pulsing badge with warning
- **Dropdown**: Shows full address, wallet type, disconnect button

### Wallet Modal
- Clean cyberpunk design matching existing theme
- MetaMask and Phantom options
- Error messages in Gen-Z tone
- Network switch button when needed
- Install links for missing wallets

## 🔐 Security Features

### Validation
- Checks wallet availability before connection
- Validates network before transactions
- Handles user rejection gracefully
- Detects locked wallets

### Event Listeners
- `accountsChanged` - Auto-updates on account switch
- `chainChanged` - Reloads page on network change
- Cleanup on unmount

### Error Handling
User-friendly error messages:
- "YO, NO WALLET DETECTED. INSTALL METAMASK OR PHANTOM FIRST."
- "CONNECTION REJECTED. VIBE CHECK FAILED."
- "WALLET REQUEST PENDING. CHECK YOUR EXTENSION."
- "WRONG NETWORK. SWITCH TO SEPOLIA TESTNET."

## 🧪 Testing

### Manual Testing Checklist
- [ ] Connect with MetaMask
- [ ] Connect with Phantom
- [ ] Switch accounts in wallet
- [ ] Switch networks in wallet
- [ ] Disconnect wallet
- [ ] Refresh page (should auto-reconnect)
- [ ] Try connecting without wallet installed
- [ ] Reject connection request
- [ ] Connect on wrong network
- [ ] Switch to Sepolia from modal
- [ ] Test on mobile

### Test Wallets
Get Sepolia testnet ETH:
- https://sepoliafaucet.com/
- https://www.alchemy.com/faucets/ethereum-sepolia

## 📱 Mobile Support
- Responsive wallet modal
- Mobile menu integration
- Touch-friendly buttons
- Works with mobile wallet browsers

## 🔮 Next Steps

### Ready for Integration
The wallet system is ready for:
1. **NFT Minting** - Use `signer` to call mint functions
2. **NFT Purchases** - Execute buy transactions
3. **Marketplace Actions** - List, bid, transfer NFTs
4. **Balance Display** - Show ETH balance
5. **Transaction History** - Track user transactions

### Example: Mint NFT
```tsx
const mintNFT = async () => {
  const { signer } = useWallet();
  const contract = new Contract(NFT_ADDRESS, NFT_ABI, signer);
  
  const tx = await contract.mint(tokenURI, {
    value: parseEther('0.1') // Price in ETH
  });
  
  await tx.wait();
  console.log('Minted!', tx.hash);
};
```

## 🐛 Troubleshooting

### Wallet Not Detected
- Ensure MetaMask/Phantom extension is installed
- Check browser compatibility (Chrome, Firefox, Brave)
- Refresh page after installing wallet

### Connection Fails
- Check if wallet is unlocked
- Look for pending requests in wallet popup
- Try disconnecting and reconnecting

### Wrong Network
- Click "Switch to Sepolia" in modal
- Or manually switch in wallet settings
- Add Sepolia network if not present

### Auto-Reconnect Not Working
- Check localStorage is enabled
- Clear browser cache and try again
- Ensure wallet is unlocked on page load

## 📚 Resources
- [Ethers.js Docs](https://docs.ethers.org/v6/)
- [MetaMask Docs](https://docs.metamask.io/)
- [Phantom Docs](https://docs.phantom.app/)
- [Sepolia Testnet](https://sepolia.dev/)

## 🎯 Summary
Complete, production-ready wallet integration with:
- Clean UI matching cyberpunk theme
- Robust error handling
- Persistent connections
- Network validation
- Ready for smart contract interactions

**NO BREAKING CHANGES** - All existing components preserved.
