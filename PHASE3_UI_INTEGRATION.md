# Phase 3: UI Integration Guide

## ✅ What's Been Created

1. **Marketplace Contract** - Deployed to: `0x187c783Ac49D255Fa5C0b232efD7b5459E544dd5`
2. **Database Tables** - listings, sales, price_history, activity_feed
3. **Service Layer** - marketplace-service.ts, gas-estimation.ts
4. **UI Components** - SellNFTModal.tsx, BuyNFTModal.tsx
5. **Environment** - VITE_MARKETPLACE_ADDRESS added

## 🎯 Next: Update NFT Detail Page

Add these imports to `pages/NFTDetail.tsx`:

```typescript
import { useWallet } from '../contexts/WalletContext';
import { getActiveListing } from '../lib/services/marketplace-service';
import { cancelListingService } from '../lib/services/marketplace-service';
import type { Listing } from '../lib/supabase/types';
import SellNFTModal from '../components/SellNFTModal';
import BuyNFTModal from '../components/BuyNFTModal';
```

Add these state variables after existing useState declarations:

```typescript
const { wallet, signer } = useWallet();
const [listing, setListing] = useState<Listing | null>(null);
const [showSellModal, setShowSellModal] = useState(false);
const [showBuyModal, setShowBuyModal] = useState(false);
const [isCancelling, setIsCancelling] = useState(false);
```

Add this function to fetch listing:

```typescript
const fetchListing = async (nftId: string) => {
  const listingData = await getActiveListing(nftId);
  setListing(listingData);
};
```

Update the `fetchNFT` function to also fetch listing:

```typescript
const fetchNFT = async (nftId: string) => {
  setIsLoading(true);
  setError(null);
  try {
    const data = await getNFTById(nftId);
    if (!data) {
      setError('NFT not found');
    } else {
      setNft(data);
      await fetchListing(nftId); // Add this line
    }
  } catch (err: any) {
    console.error('Error fetching NFT:', err);
    setError('Failed to load NFT');
  } finally {
    setIsLoading(false);
  }
};
```

Add cancel listing handler:

```typescript
const handleCancelListing = async () => {
  if (!signer || !nft || !listing) return;
  
  setIsCancelling(true);
  try {
    await cancelListingService(signer, nft.id, nft.token_id, listing.id);
    await fetchListing(nft.id);
  } catch (err: any) {
    console.error('Cancel failed:', err);
    alert('Failed to cancel listing');
  } finally {
    setIsCancelling(false);
  }
};
```

Add success handlers:

```typescript
const handleSellSuccess = () => {
  setShowSellModal(false);
  if (nft) {
    fetchListing(nft.id);
  }
};

const handleBuySuccess = () => {
  setShowBuyModal(false);
  if (id) {
    fetchNFT(id);
  }
};
```

## 📍 Where to Add Buttons

Find this section in the NFT Detail page (around line 200-250):

```typescript
<div className="flex gap-2">
  <button className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-pink-500 transition-colors">
    <Heart size={20} />
  </button>
  <button className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-cyan-500 transition-colors">
    <Download size={20} />
  </button>
</div>
```

**Replace it with:**

```typescript
<div className="flex gap-2">
  {/* Show appropriate button based on ownership and listing status */}
  {wallet && nft && wallet.address.toLowerCase() === nft.owner_wallet.toLowerCase() ? (
    // Owner buttons
    listing ? (
      <button
        onClick={handleCancelListing}
        disabled={isCancelling}
        className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-black uppercase disabled:opacity-50"
      >
        {isCancelling ? 'Cancelling...' : 'Cancel Listing'}
      </button>
    ) : (
      <button
        onClick={() => setShowSellModal(true)}
        className="px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-black uppercase"
      >
        List for Sale
      </button>
    )
  ) : listing ? (
    // Buyer button
    <button
      onClick={() => setShowBuyModal(true)}
      className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-black font-black uppercase"
    >
      Buy Now - {listing.price_eth} ETH
    </button>
  ) : null}
  
  <button className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-pink-500 transition-colors">
    <Heart size={20} />
  </button>
</div>
```

## 📍 Add Listing Info Display

After the NFT name/description section, add:

```typescript
{/* Listing Info */}
{listing && (
  <div className="bg-gradient-to-r from-cyan-500/10 to-pink-500/10 border border-cyan-500/50 p-6 rounded-2xl">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs text-zinc-400 uppercase mb-1">Current Price</p>
        <p className="text-3xl font-black text-cyan-500">{listing.price_eth} ETH</p>
      </div>
      <div className="text-right">
        <p className="text-xs text-zinc-400 uppercase mb-1">Seller</p>
        <p className="text-sm font-mono text-white">
          {listing.seller_wallet.slice(0, 6)}...{listing.seller_wallet.slice(-4)}
        </p>
      </div>
    </div>
  </div>
)}
```

## 📍 Add Modals at the End

Before the closing `</div>` of the component, add:

```typescript
{/* Sell Modal */}
{showSellModal && nft && (
  <SellNFTModal
    nftId={nft.id}
    tokenId={nft.token_id}
    nftName={nft.name}
    onClose={() => setShowSellModal(false)}
    onSuccess={handleSellSuccess}
  />
)}

{/* Buy Modal */}
{showBuyModal && nft && listing && (
  <BuyNFTModal
    nftId={nft.id}
    tokenId={nft.token_id}
    listingId={listing.id}
    nftName={nft.name}
    priceEth={listing.price_eth}
    sellerWallet={listing.seller_wallet}
    onClose={() => setShowBuyModal(false)}
    onSuccess={handleBuySuccess}
  />
)}
```

## 🔄 Restart Dev Server

After making these changes:

```bash
# Stop your dev server (Ctrl+C)
# Restart it
npm run dev
```

## ✅ Testing Checklist

1. **View NFT Detail Page**
   - If you own the NFT → See "List for Sale" button
   - If NFT is listed by you → See "Cancel Listing" button
   - If NFT is listed by someone else → See "Buy Now" button

2. **Test Listing**
   - Click "List for Sale"
   - Enter price (e.g., 0.01 ETH)
   - See gas estimate
   - Click "List NFT"
   - Approve marketplace (first time only)
   - Confirm listing transaction
   - Wait for confirmation
   - Button changes to "Cancel Listing"

3. **Test Buying** (use different wallet)
   - Connect with different wallet
   - View listed NFT
   - Click "Buy Now"
   - See total cost with gas
   - Click "Confirm Purchase"
   - Wait for confirmation
   - NFT ownership transfers

4. **Test Cancelling**
   - As seller, click "Cancel Listing"
   - Confirm transaction
   - Listing removed

## 🐛 Common Issues

### "Wallet not connected"
**Solution**: Click "Connect Wallet" first

### "Marketplace not approved"
**Solution**: The modal will automatically approve on first listing

### "Insufficient funds"
**Solution**: Make sure wallet has enough ETH for price + gas

### Buttons not showing
**Solution**: Make sure you restarted dev server after adding VITE_MARKETPLACE_ADDRESS

## 📊 Check Database

After listing/buying, verify in Supabase:

```sql
-- Check listings
SELECT * FROM listings ORDER BY created_at DESC;

-- Check sales
SELECT * FROM sales ORDER BY sold_at DESC;

-- Check activity
SELECT * FROM activity_feed ORDER BY timestamp DESC;
```

## 🎉 Success!

Once you complete these steps, your marketplace will be fully functional:
- ✅ List NFTs for sale
- ✅ Buy listed NFTs
- ✅ Cancel listings
- ✅ Gas estimation
- ✅ Database tracking
- ✅ Real-time updates

## 📝 Quick Copy-Paste Summary

1. Add imports to NFTDetail.tsx
2. Add state variables
3. Add fetchListing function
4. Update fetchNFT to call fetchListing
5. Add cancel/success handlers
6. Replace button section with marketplace buttons
7. Add listing info display
8. Add modals at end
9. Restart dev server
10. Test!

Need help? Check console logs for detailed error messages.
