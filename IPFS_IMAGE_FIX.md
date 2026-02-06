# IPFS Image Display Fix

## Problem
Images uploaded to Pinata IPFS were not displaying in the NFT cards and detail pages. The images were successfully uploaded but showed as broken images in the UI.

## Root Cause
The `NFTCard` component was using `nft.image_url` directly without converting IPFS URIs (`ipfs://...`) to HTTP gateway URLs. Browsers cannot load `ipfs://` protocol URLs directly - they need to be converted to HTTP URLs via an IPFS gateway.

## Solution

### 1. Fixed NFTCard Component
- Added import for `getIPFSGatewayUrl` from `lib/ipfs/pinata.ts`
- Convert IPFS URIs to gateway URLs before rendering
- Added fallback to multiple IPFS gateways (Pinata, ipfs.io, Cloudflare)
- Added debug logging to track image loading

### 2. Fixed NFTDetail Component
- Already had gateway conversion, but added fallback gateways
- Added retry logic with alternative gateways

### 3. Updated Mint Service
- Changed to store IPFS URIs (`ipfs://...`) in database instead of gateway URLs
- This allows flexibility to change gateways later without database migration

### 4. Enhanced getIPFSGatewayUrl Function
- Added validation for empty URIs
- Added support for already-converted HTTP URLs
- Normalized gateway URL formatting

## How It Works

### Data Flow
1. **Minting**: Image uploaded to Pinata → Returns IPFS hash (e.g., `QmX7QKJhd6DW4bu7WVb58Vy5UJ9rxLAptuohJKbsGkvUek`)
2. **Storage**: IPFS URI stored in database (e.g., `ipfs://QmX7QKJhd6DW4bu7WVb58Vy5UJ9rxLAptuohJKbsGkvUek`)
3. **Display**: IPFS URI converted to gateway URL (e.g., `https://gateway.pinata.cloud/ipfs/QmX7QKJhd6DW4bu7WVb58Vy5UJ9rxLAptuohJKbsGkvUek`)

### Gateway Fallback
If an image fails to load from one gateway, the component automatically tries alternative gateways:
1. Pinata Gateway (primary): `https://gateway.pinata.cloud/ipfs/`
2. IPFS.io Gateway (fallback 1): `https://ipfs.io/ipfs/`
3. Cloudflare Gateway (fallback 2): `https://cloudflare-ipfs.com/ipfs/`

## Testing

### Check Console Logs
Open browser console and look for:
- `🖼️ NFT Image:` - Shows original IPFS URI and converted gateway URL
- `⚠️ Image load failed, trying gateway X` - Shows gateway fallback attempts
- `❌ All IPFS gateways failed` - All gateways failed (rare)

### Verify Image URLs
1. Go to Explore page
2. Open browser DevTools → Network tab
3. Filter by "Img"
4. Check that image requests are going to `https://gateway.pinata.cloud/ipfs/...`

### Test Existing NFT
Your minted NFT (Token ID: 1) should now display correctly:
- Image hash: `QmX7QKJhd6DW4bu7WVb58Vy5UJ9rxLAptuohJKbsGkvUek`
- Gateway URL: `https://gateway.pinata.cloud/ipfs/QmX7QKJhd6DW4bu7WVb58Vy5UJ9rxLAptuohJKbsGkvUek`

## Files Modified
- `components/NFTCard.tsx` - Added IPFS gateway conversion and fallback
- `pages/NFTDetail.tsx` - Added gateway fallback logic
- `lib/services/mint-service.ts` - Store IPFS URI instead of gateway URL
- `lib/ipfs/pinata.ts` - Enhanced gateway URL conversion

## Environment Variables
Ensure `.env.local` has:
```
VITE_IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs/
```

## Next Steps
1. Refresh your browser to load the updated code
2. Navigate to Explore page
3. Your minted NFT should now display the image correctly
4. Check browser console for debug logs
5. If images still don't load, check Network tab for CORS or 404 errors
