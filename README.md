<div align="center">

# NEON CHAOS - NFT Underground Marketplace

A cyberpunk-themed NFT marketplace with AI-powered pricing and complete Ethereum wallet integration.
## ✨ Features

- 🎨 **Cyberpunk UI** - Dark, neon, Gen-Z aesthetic
- 🦊 **MetaMask Integration** - Connect with MetaMask wallet
- 👻 **Phantom Support** - Ethereum mode wallet support
- 🔗 **Sepolia Testnet** - Safe testing environment
- 🤖 **AI Pricing** - Gemini-powered NFT recommendations
- 📱 **Mobile Responsive** - Works on all devices
- 🔄 **Auto-Reconnect** - Persistent wallet connections
- ⚡ **Real-time Updates** - Account & network change detection

## 🚀 Quick Start

**Prerequisites:** Node.js, MetaMask or Phantom wallet

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   - Copy `.env.example` to `.env.local`
   - Set your `GEMINI_API_KEY` in `.env.local`
   - (Optional) Add your contract addresses

3. **Run the app:**
   ```bash
   npm run dev
   ```

4. **Connect your wallet:**
   - Click "CONNECT WALLET" in the navbar
   - Choose MetaMask or Phantom
   - Switch to Sepolia testnet if needed

## 🦊 Wallet Integration

### Supported Wallets
- **MetaMask** - Most popular Ethereum wallet
- **Phantom** - Multi-chain wallet (Ethereum mode)

### Features
- ✅ One-click connection
- ✅ Network validation (Sepolia)
- ✅ Auto-reconnection on page reload
- ✅ Account change detection
- ✅ Network switch functionality
- ✅ Persistent state
- ✅ Mobile support

### Quick Usage
```tsx
import { useWallet } from './contexts/WalletContext';

function MyComponent() {
  const { walletAddress, signer, provider } = useWallet();
  
  // Use signer for transactions
  // Use provider for reading blockchain
}
```

### Documentation
- 📖 **Quick Start**: [QUICKSTART_WALLET.md](QUICKSTART_WALLET.md)
- 📚 **Full Docs**: [WALLET_INTEGRATION.md](WALLET_INTEGRATION.md)
- 🎨 **Features Guide**: [WALLET_FEATURES.md](WALLET_FEATURES.md)
- 💻 **Code Examples**: [examples/WalletIntegrationExamples.tsx](examples/WalletIntegrationExamples.tsx)
- ✅ **Deployment**: [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)

## 🧪 Testing

### Get Test ETH
- [Sepolia Faucet](https://sepoliafaucet.com/)
- [Alchemy Faucet](https://www.alchemy.com/faucets/ethereum-sepolia)

### Test Checklist
- [ ] Connect MetaMask
- [ ] Connect Phantom
- [ ] Switch accounts
- [ ] Switch networks
- [ ] Disconnect wallet
- [ ] Refresh page (auto-reconnect)
- [ ] Test on mobile

## 🏗️ Project Structure

```
├── components/          # React components
│   ├── Navbar.tsx      # Navigation with wallet UI
│   ├── WalletModal.tsx # Wallet connection modal
│   └── ...
├── contexts/           # React contexts
│   └── WalletContext.tsx  # Wallet state management
├── hooks/              # Custom React hooks
│   └── useWalletBalance.ts
├── utils/              # Utility functions
│   └── walletHelpers.ts
├── pages/              # Page components
├── examples/           # Code examples
└── types.d.ts          # TypeScript definitions
```

## 🔧 Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS
- **Blockchain**: Ethers.js v6
- **Network**: Ethereum Sepolia Testnet
- **AI**: Google Gemini API
- **Icons**: Lucide React

## 📦 Environment Variables

```env
# API Keys
GEMINI_API_KEY=your_gemini_api_key

# Blockchain (Sepolia Testnet)
VITE_CHAIN_ID=11155111
VITE_CHAIN_NAME=Sepolia
VITE_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
VITE_CONTRACT_ADDRESS=your_contract_address
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy Options
- **Vercel**: `vercel`
- **Netlify**: `netlify deploy --prod --dir=dist`
- **GitHub Pages**: Upload `dist/` folder

See [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) for full guide.

## 🔮 Next Steps

### Ready to Implement
1. **NFT Minting** - Add your mint contract
2. **NFT Marketplace** - Buy/sell functionality
3. **User Collections** - Display owned NFTs
4. **Transaction History** - Track user activity
5. **Wallet Balance** - Show ETH balance

### Example: Mint NFT
```tsx
import { useWallet } from './contexts/WalletContext';
import { Contract, parseEther } from 'ethers';

function MintButton() {
  const { signer } = useWallet();
  
  const handleMint = async () => {
    const contract = new Contract(address, abi, signer);
    const tx = await contract.mint({ value: parseEther('0.01') });
    await tx.wait();
  };
  
  return <button onClick={handleMint}>MINT NFT</button>;
}
```

## 📚 Resources

- [Ethers.js Documentation](https://docs.ethers.org/v6/)
- [MetaMask Documentation](https://docs.metamask.io/)
- [Phantom Documentation](https://docs.phantom.app/)
- [Sepolia Testnet Info](https://sepolia.dev/)
- [Gemini API](https://ai.google.dev/)

## 🐛 Troubleshooting

**Wallet not connecting?**
- Ensure MetaMask/Phantom is installed
- Check if wallet is unlocked
- Try refreshing the page

**Wrong network?**
- Click "Switch to Sepolia" in the modal
- Or manually switch in your wallet

**Transaction failing?**
- Check you have enough Sepolia ETH
- Verify contract address is correct
- Check network congestion

## 📄 License

MIT License - feel free to use this project however you'd like!

## 🎉 Credits

Built with ❤️ using AI Studio and powered by Gemini AI.

---

**Ready to mint some chaos? Connect your wallet and dive in! 🚀**
