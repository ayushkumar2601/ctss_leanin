# 🛠️ CTsync Tech Stack

## Frontend

### Core Framework
- **React 19.2.4** - UI library
- **TypeScript 5.8.2** - Type-safe JavaScript
- **Vite 6.2.0** - Build tool & dev server
- **React Router DOM 7.13.0** - Client-side routing

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React 0.563.0** - Icon library
- **Recharts 3.7.0** - Data visualization charts

## Blockchain

### Web3 Integration
- **Ethers.js 6.13.0** - Ethereum library for wallet connection & smart contracts
- **Sepolia Testnet** - Ethereum test network (Chain ID: 11155111)
- **MetaMask / WalletConnect** - Wallet providers

### Smart Contracts
- **Solidity** - Smart contract language
- **Hardhat** - Ethereum development environment
- **OpenZeppelin Contracts** - Secure smart contract library
  - ERC721 (NFT standard)
  - ERC721URIStorage
  - Ownable
  - ReentrancyGuard

### Contracts Deployed
- **NeonChaosNFT.sol** - ERC721 NFT contract for evidence tokens
- **NFTMarketplace.sol** - Marketplace contract (repurposed for issue resolution)

## Backend & Database

### Database
- **Supabase** - PostgreSQL database with real-time capabilities
- **PostgreSQL** - Relational database
- **Row Level Security (RLS)** - Database-level access control

### Storage
- **Pinata** - IPFS pinning service for decentralized storage
- **IPFS** - Decentralized file storage for images & metadata

## AI & APIs

### AI Services
- **Groq API** - AI inference for urgency assessment
  - Model: **Llama 3.3 70B Versatile** (`llama-3.3-70b-versatile`)
  - Temperature: 0.3 (for consistent, professional responses)
  - Max tokens: 150
- **Google Generative AI (@google/genai 1.38.0)** - AI model integration (available for future features)

### External Services
- **Etherscan API** - Blockchain explorer integration
- **Infura** - Ethereum RPC provider

## Development Tools

### Build & Dev
- **Vite** - Fast build tool with HMR
- **@vitejs/plugin-react 5.0.0** - React plugin for Vite
- **TypeScript** - Static type checking

### Package Management
- **npm** - Node package manager

## Architecture

### Design Patterns
- **Context API** - State management (WalletContext)
- **Custom Hooks** - Reusable logic
  - useWallet
  - useENS
  - useUserNFTs
  - useWalletBalance
  - usePersistentState
  - useLastVisitedPage

### Project Structure
```
├── components/        # Reusable UI components
├── pages/            # Route pages
├── contexts/         # React contexts
├── hooks/            # Custom React hooks
├── lib/
│   ├── contracts/    # Smart contract interactions
│   ├── ipfs/         # IPFS/Pinata integration
│   ├── services/     # Business logic
│   ├── supabase/     # Database operations
│   └── utils/        # Helper functions
├── contracts/        # Solidity smart contracts
└── supabase/         # Database schemas & migrations
```

## Infrastructure

### Hosting & Deployment
- **Vercel / Netlify** (recommended for frontend)
- **Supabase Cloud** - Database & backend
- **IPFS/Pinata** - Decentralized storage
- **Ethereum Sepolia** - Blockchain network

### Environment Variables
- Supabase credentials
- Pinata API keys
- Groq API key
- Contract addresses
- RPC URLs

## Key Features Enabled

### Blockchain Features
- ✅ Wallet connection (MetaMask, WalletConnect)
- ✅ NFT minting (ERC721)
- ✅ Transaction signing
- ✅ Gas estimation
- ✅ Network switching
- ✅ ENS resolution

### Database Features
- ✅ Real-time data sync
- ✅ Row-level security
- ✅ Audit trails
- ✅ Status tracking
- ✅ User management

### AI Features
- ✅ Image analysis
- ✅ Urgency assessment
- ✅ Confidence scoring
- ✅ Professional recommendations

### Storage Features
- ✅ Decentralized image storage (IPFS)
- ✅ Metadata storage
- ✅ Gateway URLs for access
- ✅ Permanent storage via Pinata

## Browser Support
- Chrome/Edge (recommended)
- Firefox
- Brave
- Any browser with Web3 wallet extension

## Network Requirements
- Ethereum Sepolia testnet
- IPFS gateway access
- Supabase API access
- Groq API access
