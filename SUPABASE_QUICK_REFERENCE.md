# 🚀 Supabase Quick Reference

## One-Page Cheat Sheet for NFT Database

---

## 📦 Installation

```bash
npm install @supabase/supabase-js
```

---

## ⚙️ Environment Setup

`.env.local`:
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

---

## 🗃️ Database Tables

### users
```sql
wallet_address | wallet_type | created_at
```

### nfts
```sql
token_id | contract_address | owner_wallet | name | 
image_url | mint_tx_hash | minted_at
```

### nft_attributes
```sql
nft_id | trait_type | value
```

---

## 💻 Common Operations

### Save Minted NFT

```typescript
import { saveMintedNFT } from './lib/supabase/nft-service';

await saveMintedNFT({
  tokenId: '1',
  contractAddress: '0xContract',
  chainId: 11155111,
  ownerWallet: walletAddress,
  name: 'My NFT',
  description: 'Description',
  imageUrl: 'https://...',
  metadataUri: 'ipfs://...',
  mintTxHash: tx.hash,
  mintedAt: new Date(),
  attributes: [
    { trait_type: 'Rarity', value: 'Legendary' }
  ]
});
```

### Fetch User's NFTs

```typescript
import { useUserNFTs } from './hooks/useUserNFTs';

const { nfts, isLoading, error, refetch } = useUserNFTs(walletAddress);
```

### Get Specific NFT

```typescript
import { getNFTByTokenId } from './lib/supabase/nft-service';

const nft = await getNFTByTokenId('1', '0xContract', 11155111);
```

---

## 🎨 UI Components

### Dashboard

```typescript
import Dashboard from './pages/Dashboard';

// Route: /dashboard
// Shows user's NFT collection
```

### NFT Card

```typescript
import NFTCard from './components/NFTCard';

<NFTCard nft={nft} />
```

---

## 🔧 Setup Steps

1. **Create Supabase Project**
   - Go to supabase.com
   - Create new project
   - Copy URL and anon key

2. **Run Schema**
   - Open SQL Editor
   - Paste `supabase/schema.sql`
   - Click Run

3. **Configure .env.local**
   - Add VITE_SUPABASE_URL
   - Add VITE_SUPABASE_ANON_KEY

4. **Test**
   - `npm run dev`
   - Connect wallet
   - Visit `/dashboard`

---

## 🐛 Quick Fixes

### "Missing environment variables"
```bash
# Add to .env.local, then:
npm run dev
```

### "relation does not exist"
```sql
-- Run in Supabase SQL Editor:
-- Copy/paste supabase/schema.sql
```

### "Failed to fetch NFTs"
```typescript
// Check:
1. Supabase project is active
2. API keys are correct
3. RLS policies exist
```

---

## 📊 Useful Queries

### Count NFTs
```sql
SELECT COUNT(*) FROM nfts WHERE owner_wallet = '0x...';
```

### Recent Mints
```sql
SELECT * FROM nfts ORDER BY minted_at DESC LIMIT 10;
```

### NFTs with Attributes
```sql
SELECT n.*, a.trait_type, a.value
FROM nfts n
LEFT JOIN nft_attributes a ON n.id = a.nft_id
WHERE n.owner_wallet = '0x...';
```

---

## 🔒 Security

- ✅ RLS enabled on all tables
- ✅ Users can only see their own NFTs
- ✅ Unique mint transaction hashes
- ✅ Wallet address normalization

---

## 📁 Key Files

```
lib/supabase/
  ├── types.ts          # TypeScript types
  ├── client.ts         # Supabase client
  └── nft-service.ts    # Business logic

hooks/
  └── useUserNFTs.ts    # React hook

components/
  └── NFTCard.tsx       # NFT display

pages/
  └── Dashboard.tsx     # Collection view

supabase/
  └── schema.sql        # Database schema
```

---

## 🚀 Production Checklist

- [ ] Supabase project created
- [ ] Schema deployed
- [ ] RLS policies enabled
- [ ] Environment variables set
- [ ] Wallet integration tested
- [ ] Dashboard loads correctly
- [ ] Mint flow integrated

---

## 📚 Documentation

- Full Setup: `SUPABASE_SETUP.md`
- Implementation: `SUPABASE_IMPLEMENTATION.md`
- Mint Example: `examples/MintIntegrationExample.tsx`

---

**Quick Start**: Follow `SUPABASE_SETUP.md` → Takes 10 minutes
