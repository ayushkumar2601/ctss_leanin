# PHASE 3: MARKETPLACE IMPLEMENTATION GUIDE

## Overview
This guide covers the complete implementation of Phase 3: Advanced Features for the NEON CHAOS NFT Marketplace.

## ✅ Completed Steps

### 1. Smart Contract
- **File**: `contracts/contracts/NFTMarketplace.sol`
- **Features**:
  - Fixed-price listings
  - Buy/Sell functionality
  - Platform fee (2.5% default)
  - Reentrancy protection
  - Ownable pattern
  - Events: NFTListed, NFTSold, NFTDelisted

### 2. Deployment Script
- **File**: `contracts/scripts/deploy-marketplace.js`
- **Usage**: `cd contracts && npm run deploy:marketplace`

### 3. Database Schema
- **File**: `supabase/schema.sql` (updated)
- **New Tables**:
  - `listings` - Active/sold/cancelled listings
  - `sales` - Sale records
  - `price_history` - Price tracking
  - `activity_feed` - Real-time activity

### 4. TypeScript Types
- **File**: `lib/supabase/types.ts` (updated)
- **New Types**: Listing, Sale, PriceHistory, ActivityFeed

## 📋 Next Steps

### Step 1: Deploy Marketplace Contract

```bash
cd contracts
npm run deploy:marketplace
```

Add the marketplace address to `.env.local`:
```
VITE_MARKETPLACE_ADDRESS=0x...
```

### Step 2: Run Database Migrations

Execute the updated schema in Supabase:
1. Go to Supabase Dashboard → SQL Editor
2. Copy contents of `supabase/schema.sql`
3. Run the Phase 3 section (or entire file)

### Step 3: Implement Marketplace Contract Integration

Create `lib/contracts/marketplace-contract.ts`:
- approveNFT()
- listNFT()
- buyNFT()
- cancelListing()
- getListing()
- estimateGas() for each operation

### Step 4: Implement Marketplace Services

Create `lib/services/marketplace-service.ts`:
- createListing() - List NFT + save to DB
- purchaseNFT() - Buy NFT + update DB
- cancelListing() - Cancel + update DB
- getActiveListings()
- getListingByNFT()

### Step 5: Implement Activity Feed

Create `lib/services/activity-service.ts`:
- recordActivity()
- getRecentActivity()
- subscribeToActivity() - Real-time updates

### Step 6: Implement Gas Estimation

Create `lib/utils/gas-estimation.ts`:
- estimateGasForMint()
- estimateGasForList()
- estimateGasForBuy()
- formatGasEstimate() - Display-friendly format

### Step 7: Create UI Components

**Sell Modal** (`components/SellNFTModal.tsx`):
- Price input
- Gas estimation display
- Approve + List flow
- Loading states

**Buy Modal** (`components/BuyNFTModal.tsx`):
- Price display
- Gas estimation
- Confirm purchase
- Success/error handling

**Activity Feed** (`components/ActivityFeed.tsx`):
- Real-time activity list
- Activity type icons
- Wallet addresses
- Timestamps

### Step 8: Update Existing Pages

**NFT Detail Page**:
- Show listing price if listed
- "Buy Now" button for buyers
- "List for Sale" button for owners
- "Cancel Listing" button for sellers
- Price history chart/timeline

**Explore Page**:
- Filter by "For Sale"
- Show listing prices
- Sort by price

**Dashboard Page**:
- User's active listings
- User's sales history
- Earnings summary

### Step 9: Add Activity Page

Create `pages/Activity.tsx`:
- Global activity feed
- Real-time updates
- Filter by activity type
- Pagination

## 🔧 Implementation Details

### Marketplace Flow

#### Listing Flow:
```
1. User clicks "List for Sale"
2. Enter price
3. Estimate gas for approval + listing
4. Approve marketplace contract
5. Call listNFT() on contract
6. Wait for confirmation
7. Save listing to Supabase
8. Record price history
9. Record activity
```

#### Buying Flow:
```
1. User clicks "Buy Now"
2. Show price + gas estimate
3. Confirm purchase
4. Call buyNFT() on contract (send ETH)
5. Wait for confirmation
6. Update listing status
7. Update NFT owner
8. Record sale
9. Record price history
10. Record activity
```

### Real-time Activity

Use Supabase real-time subscriptions:
```typescript
const subscription = supabase
  .channel('activity')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'activity_feed'
  }, (payload) => {
    // Update UI with new activity
  })
  .subscribe();
```

### Gas Estimation

```typescript
// Estimate gas before transaction
const gasEstimate = await contract.listNFT.estimateGas(
  nftContract,
  tokenId,
  priceInWei
);

const gasPrice = await provider.getFeeData();
const gasCost = gasEstimate * gasPrice.gasPrice;
const gasCostEth = ethers.formatEther(gasCost);
```

## 🔒 Security Considerations

1. **Ownership Verification**: Always verify NFT ownership before listing
2. **Approval Check**: Verify marketplace approval before listing
3. **Listing State**: Check listing is active before buying
4. **Race Conditions**: Handle concurrent buy attempts
5. **Transaction Confirmation**: Wait for confirmation before DB updates
6. **Error Handling**: Handle reverted transactions gracefully

## 🧪 Testing Checklist

- [ ] Deploy marketplace contract
- [ ] Run database migrations
- [ ] Test listing NFT
- [ ] Test buying NFT
- [ ] Test cancelling listing
- [ ] Test gas estimation
- [ ] Test real-time activity feed
- [ ] Test price history tracking
- [ ] Test with multiple users
- [ ] Test error scenarios

## 📊 Database Queries

### Get Active Listings:
```sql
SELECT * FROM active_listings_view ORDER BY listed_at DESC;
```

### Get NFT with Listing:
```sql
SELECT n.*, l.price_eth, l.seller_wallet, l.status
FROM nfts n
LEFT JOIN listings l ON n.id = l.nft_id AND l.status = 'active'
WHERE n.id = 'nft-uuid';
```

### Get Price History:
```sql
SELECT * FROM price_history 
WHERE nft_id = 'nft-uuid' 
ORDER BY timestamp DESC;
```

### Get Recent Activity:
```sql
SELECT * FROM recent_activity_view LIMIT 20;
```

## 🚀 Deployment Order

1. Deploy marketplace contract to Sepolia
2. Update `.env.local` with marketplace address
3. Run database migrations in Supabase
4. Implement contract integration layer
5. Implement service layer
6. Implement UI components
7. Update existing pages
8. Test end-to-end flows
9. Deploy frontend

## 📝 Environment Variables

Add to `.env.local`:
```
VITE_MARKETPLACE_ADDRESS=0x...
VITE_PLATFORM_FEE=250
```

## 🎯 Success Criteria

- ✅ Users can list NFTs for sale
- ✅ Users can buy listed NFTs
- ✅ Users can cancel their listings
- ✅ Gas estimates shown before transactions
- ✅ Real-time activity feed updates
- ✅ Price history tracked and displayed
- ✅ Platform fees collected
- ✅ All transactions confirmed on-chain
- ✅ Database stays in sync with blockchain

## 📚 Additional Resources

- OpenZeppelin Contracts: https://docs.openzeppelin.com/contracts
- Ethers.js v6 Docs: https://docs.ethers.org/v6/
- Supabase Realtime: https://supabase.com/docs/guides/realtime
- Hardhat Documentation: https://hardhat.org/docs

## 🐛 Common Issues

### Issue: "Marketplace not approved"
**Solution**: Call `nftContract.approve(marketplaceAddress, tokenId)` first

### Issue: "Not the owner"
**Solution**: Verify wallet owns the NFT before listing

### Issue: "Insufficient payment"
**Solution**: Ensure msg.value >= listing price

### Issue: Real-time not working
**Solution**: Check Supabase realtime is enabled for your project

## 📞 Support

If you encounter issues:
1. Check console logs for errors
2. Verify contract addresses in `.env.local`
3. Check Sepolia Etherscan for transaction status
4. Verify database schema is up to date
5. Check wallet has sufficient ETH for gas

---

**Next**: Start with Step 1 - Deploy the marketplace contract!
