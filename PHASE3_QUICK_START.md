# 🚀 PHASE 3: QUICK START GUIDE

## What's Been Created

### ✅ Smart Contracts
- **NFTMarketplace.sol** - Complete marketplace contract with buy/sell/cancel
- **deploy-marketplace.js** - Deployment script

### ✅ Database Schema
- **listings** table - Track NFT listings
- **sales** table - Record sales
- **price_history** table - Price tracking
- **activity_feed** table - Real-time activity
- Views and indexes for performance

### ✅ TypeScript Integration
- **marketplace-contract.ts** - Contract interaction layer
- **types.ts** - Updated with marketplace types

### ✅ Documentation
- **PHASE3_IMPLEMENTATION_GUIDE.md** - Complete implementation guide
- **PHASE3_QUICK_START.md** - This file

## 🎯 Next Steps (In Order)

### 1. Deploy Marketplace Contract (5 minutes)

```bash
cd contracts
npm run deploy:marketplace
```

Copy the marketplace address and add to `.env.local`:
```
VITE_MARKETPLACE_ADDRESS=0x...
```

### 2. Update Database (2 minutes)

1. Open Supabase Dashboard
2. Go to SQL Editor
3. Copy the Phase 3 section from `supabase/schema.sql`
4. Execute the SQL

### 3. Create Remaining Service Files

You need to create these files (I'll provide templates):

**lib/services/marketplace-service.ts** - High-level marketplace operations
**lib/services/activity-service.ts** - Activity feed management  
**lib/utils/gas-estimation.ts** - Gas estimation utilities

### 4. Create UI Components

**components/SellNFTModal.tsx** - Modal for listing NFTs
**components/BuyNFTModal.tsx** - Modal for buying NFTs
**components/ActivityFeed.tsx** - Real-time activity component

### 5. Update Existing Pages

**pages/NFTDetail.tsx** - Add buy/sell buttons and listing info
**pages/Explore.tsx** - Show listing prices, add "For Sale" filter
**pages/Dashboard.tsx** - Show user's listings and sales

### 6. Create Activity Page

**pages/Activity.tsx** - Global activity feed page

## 📝 Quick Implementation Checklist

- [ ] Deploy marketplace contract
- [ ] Add VITE_MARKETPLACE_ADDRESS to .env.local
- [ ] Run database migrations
- [ ] Restart dev server
- [ ] Create marketplace-service.ts
- [ ] Create activity-service.ts
- [ ] Create gas-estimation.ts
- [ ] Create SellNFTModal component
- [ ] Create BuyNFTModal component
- [ ] Update NFTDetail page
- [ ] Test listing an NFT
- [ ] Test buying an NFT
- [ ] Test cancelling a listing

## 🔑 Key Concepts

### Listing Flow
1. User approves marketplace contract
2. User calls listNFT() with price
3. Contract emits NFTListed event
4. Save listing to database
5. Record activity

### Buying Flow
1. User calls buyNFT() with ETH
2. Contract transfers NFT to buyer
3. Contract transfers ETH to seller (minus fee)
4. Contract emits NFTSold event
5. Update database (listing status, ownership, sale record)
6. Record activity

### Gas Estimation
Always estimate gas before transactions:
```typescript
const gasEstimate = await contract.listNFT.estimateGas(...);
const gasPrice = await provider.getFeeData();
const cost = gasEstimate * gasPrice.gasPrice;
```

## 🛠️ Required Environment Variables

Add to `.env.local`:
```bash
# Existing
VITE_CONTRACT_ADDRESS=0x...
VITE_RPC_URL=https://sepolia.infura.io/v3/...
VITE_SUPABASE_URL=https://...
VITE_SUPABASE_ANON_KEY=...

# New for Phase 3
VITE_MARKETPLACE_ADDRESS=0x...
```

## 📊 Database Tables Overview

### listings
- Tracks active, sold, and cancelled listings
- Links to NFT via nft_id
- Stores price in ETH

### sales
- Records completed sales
- Links to listing and NFT
- Stores buyer, seller, price, platform fee

### price_history
- Tracks all price events (listed, sold, delisted)
- Used for price charts and history

### activity_feed
- Real-time activity stream
- All marketplace events
- Used for activity page and widgets

## 🎨 UI Components Needed

### SellNFTModal
- Price input (ETH)
- Gas estimation display
- Approve button (if needed)
- List button
- Loading states
- Success/error messages

### BuyNFTModal
- Price display
- Platform fee display
- Total cost display
- Gas estimation
- Confirm button
- Loading states
- Success/error messages

### ActivityFeed
- Activity list (minted, listed, sold, delisted)
- NFT thumbnails
- Wallet addresses (truncated)
- Prices
- Timestamps
- Real-time updates

## 🔐 Security Checklist

- [ ] Verify NFT ownership before listing
- [ ] Check marketplace approval before listing
- [ ] Verify listing is active before buying
- [ ] Wait for transaction confirmation before DB updates
- [ ] Handle transaction failures gracefully
- [ ] Prevent double-spending
- [ ] Validate all inputs
- [ ] Handle race conditions

## 🧪 Testing Scenarios

1. **List NFT**
   - Approve marketplace
   - List with valid price
   - Verify listing appears in database
   - Verify activity recorded

2. **Buy NFT**
   - Buy listed NFT
   - Verify ownership transferred
   - Verify seller received payment
   - Verify sale recorded

3. **Cancel Listing**
   - Cancel own listing
   - Verify listing status updated
   - Verify activity recorded

4. **Error Cases**
   - Try to list NFT you don't own
   - Try to buy with insufficient funds
   - Try to cancel someone else's listing
   - Try to buy already sold NFT

## 📈 Performance Tips

1. **Use Indexes**: Database queries use indexes for fast lookups
2. **Debounce Real-time**: Debounce activity feed updates
3. **Pagination**: Paginate activity feed and listings
4. **Caching**: Cache gas prices and platform fee
5. **Optimistic UI**: Show pending states while waiting for confirmation

## 🐛 Common Issues & Solutions

### "Marketplace not approved"
**Solution**: Call `approveMarketplace()` before listing

### "Not the owner"
**Solution**: Verify wallet owns the NFT

### "Insufficient payment"
**Solution**: Ensure buyer sends enough ETH

### Real-time not updating
**Solution**: Check Supabase realtime is enabled

### Gas estimation fails
**Solution**: Check wallet has enough ETH, verify contract state

## 📞 Need Help?

1. Check console logs for detailed errors
2. Verify all environment variables are set
3. Check Sepolia Etherscan for transaction status
4. Verify database schema is up to date
5. Ensure wallet has sufficient ETH for gas

## 🎯 Success Criteria

When Phase 3 is complete, you should be able to:
- ✅ List an NFT for sale
- ✅ Buy a listed NFT
- ✅ Cancel a listing
- ✅ See gas estimates before transactions
- ✅ View real-time activity feed
- ✅ See price history for NFTs
- ✅ Filter NFTs by "For Sale"
- ✅ View your listings and sales

## 🚀 Ready to Start?

1. Deploy the marketplace contract
2. Update your database
3. Follow the implementation guide
4. Test each feature as you build it

Good luck! 🎉
