# 🚀 PHASE 1 DEPLOYMENT GUIDE

## Complete guide to deploy and test the NFT minting system

---

## ✅ Prerequisites Checklist

Before deploying, ensure you have:

- [x] Node.js installed (v18+)
- [x] MetaMask or Phantom wallet installed
- [x] Sepolia testnet ETH (for deployment & minting)
- [x] All environment variables configured

---

## 📋 Step 1: Get Sepolia Test ETH

You need Sepolia ETH for:
1. **Deploying the contract** (~0.01 ETH)
2. **Minting NFTs** (~0.005 ETH per mint)

### Get Test ETH:
- https://sepoliafaucet.com/
- https://www.alchemy.com/faucets/ethereum-sepolia
- https://sepolia-faucet.pk910.de/

**Tip:** Get at least 0.1 ETH to have enough for multiple mints.

---

## 📋 Step 2: Configure Environment Variables

### Required Variables:

```bash
# 1. Gemini API (Already set ✅)
GEMINI_API_KEY=AIzaSyDdhwiluZBPgORaf49Uao1ZDLRHjvidwK0

# 2. Supabase (Already set ✅)
VITE_SUPABASE_URL=https://kujgnfwbnyfgnowpwotc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 3. Infura RPC (Already set ✅)
VITE_RPC_URL=https://sepolia.infura.io/v3/e5f8c8fa45104cf49b75dc91daa00199

# 4. Pinata IPFS (REQUIRED - Get these!)
VITE_PINATA_API_KEY=your_pinata_api_key_here
VITE_PINATA_SECRET=your_pinata_secret_here

# 5. Deployer Private Key (REQUIRED for deployment)
DEPLOYER_PRIVATE_KEY=your_private_key_here
```

### Get Pinata Keys:

1. Go to https://www.pinata.cloud/
2. Sign up (free account)
3. Go to **API Keys** section
4. Click "New Key"
5. Enable:
   - ✅ pinFileToIPFS
   - ✅ pinJSONToIPFS
6. Name it: `neon-chaos-minting`
7. Copy **API Key** → `VITE_PINATA_API_KEY`
8. Copy **API Secret** → `VITE_PINATA_SECRET`

### Get Deployer Private Key:

⚠️ **SECURITY WARNING:** Use a separate wallet for deployment!

1. Open MetaMask
2. Click account menu → Account Details
3. Click "Export Private Key"
4. Enter password
5. Copy private key → `DEPLOYER_PRIVATE_KEY`
6. **NEVER share this key or commit it to git!**

---

## 📋 Step 3: Install Contract Dependencies

```bash
cd contracts
npm install
```

This installs:
- Hardhat (Ethereum development environment)
- OpenZeppelin contracts (ERC-721 standard)
- Ethers.js (blockchain interaction)

---

## 📋 Step 4: Deploy Smart Contract

```bash
cd contracts
npm run deploy
```

**Expected output:**
```
🚀 Deploying NEON CHAOS NFT Contract to Sepolia...

📝 Deploying with account: 0x1234...5678
💰 Account balance: 0.1 ETH

⏳ Deploying NeonChaosNFT contract...
⏳ Transaction sent: 0xabcd...
⏳ Waiting for confirmation...

✅ Contract deployed successfully!
📍 Contract Address: 0x9876543210abcdef9876543210abcdef98765432

📋 Add this to your .env.local:
VITE_CONTRACT_ADDRESS=0x9876543210abcdef9876543210abcdef98765432

🔍 Verify contract on Etherscan:
npx hardhat verify --network sepolia 0x9876543210abcdef9876543210abcdef98765432

🌐 View on Sepolia Etherscan:
https://sepolia.etherscan.io/address/0x9876543210abcdef9876543210abcdef98765432
```

---

## 📋 Step 5: Update .env.local with Contract Address

Copy the contract address from deployment output and update `.env.local`:

```bash
VITE_CONTRACT_ADDRESS=0x9876543210abcdef9876543210abcdef98765432
```

**⚠️ IMPORTANT:** Restart your dev server after updating!

```bash
npm run dev
```

---

## 📋 Step 6: Verify Contract on Etherscan (Optional)

This makes your contract code public and verifiable:

```bash
cd contracts
npx hardhat verify --network sepolia YOUR_CONTRACT_ADDRESS
```

---

## 📋 Step 7: Test Minting Flow

### 1. Start Development Server

```bash
npm run dev
```

### 2. Connect Wallet

- Open http://localhost:5173
- Click "CONNECT WALLET"
- Choose MetaMask or Phantom
- Approve connection
- Ensure you're on Sepolia testnet

### 3. Navigate to Mint Page

- Click "MINT" in navigation
- You should see the mint form

### 4. Mint Your First NFT

1. **Upload Image:**
   - Click upload area
   - Select an image (PNG, JPG, GIF)
   - Preview should appear

2. **Fill Details:**
   - Title: `CYBER_DEMON_01`
   - Description: `First NFT on NEON CHAOS`

3. **Click "MINT YOUR CHAOS"**

4. **Watch Progress:**
   - ⏳ Uploading image to IPFS...
   - ⏳ Uploading metadata to IPFS...
   - ⏳ Minting NFT on blockchain...
   - ⏳ Saving to database...
   - ✅ NFT minted successfully!

5. **Approve Transactions:**
   - MetaMask will popup
   - Review gas fee
   - Click "Confirm"
   - Wait for confirmation (~15 seconds)

### 5. View Your NFT

- Click "VIEW IN DASHBOARD"
- Your NFT should appear!
- Click on it to see details

---

## 🧪 Testing Checklist

Test these scenarios:

### ✅ Happy Path
- [ ] Upload image successfully
- [ ] Fill in title and description
- [ ] Mint NFT successfully
- [ ] See NFT in dashboard
- [ ] View NFT details
- [ ] See transaction on Etherscan

### ✅ Error Handling
- [ ] Try minting without wallet connected
- [ ] Try minting on wrong network
- [ ] Try minting without image
- [ ] Try minting without title
- [ ] Reject transaction in wallet
- [ ] Check error messages are clear

### ✅ Data Integrity
- [ ] NFT appears in Supabase database
- [ ] Token ID matches blockchain
- [ ] Image loads from IPFS
- [ ] Metadata is correct
- [ ] Owner address is correct

---

## 🔍 Troubleshooting

### "Contract not deployed" error

**Solution:** Make sure `VITE_CONTRACT_ADDRESS` is set in `.env.local` and restart dev server.

### "Missing Pinata credentials" error

**Solution:** Set `VITE_PINATA_API_KEY` and `VITE_PINATA_SECRET` in `.env.local`.

### "Wrong network" error

**Solution:** Switch to Sepolia testnet in your wallet.

### "Insufficient funds" error

**Solution:** Get more Sepolia ETH from faucets.

### Transaction fails

**Possible causes:**
- Not enough gas
- Contract address wrong
- Network congestion

**Solution:** Check Etherscan for transaction details.

### Image not loading

**Possible causes:**
- IPFS gateway slow
- Image not pinned properly

**Solution:** Try different IPFS gateway in `.env.local`:
```bash
VITE_IPFS_GATEWAY=https://ipfs.io/ipfs/
# or
VITE_IPFS_GATEWAY=https://cloudflare-ipfs.com/ipfs/
```

### NFT not in database

**Possible causes:**
- Supabase connection failed
- RLS policies blocking

**Solution:** Check Supabase logs and verify RLS policies are correct.

---

## 📊 Verify Everything Works

### 1. Check Blockchain

Visit Etherscan:
```
https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS
```

You should see:
- Contract creation transaction
- Mint transactions
- Token transfers

### 2. Check IPFS

Visit Pinata dashboard:
```
https://app.pinata.cloud/pinmanager
```

You should see:
- Uploaded images
- Uploaded metadata JSON files

### 3. Check Database

Visit Supabase dashboard:
```
https://supabase.com/dashboard/project/kujgnfwbnyfgnowpwotc/editor
```

Go to `nfts` table, you should see:
- Minted NFTs
- Correct token IDs
- Correct owner addresses
- IPFS URLs

---

## 🎉 Success Criteria

You've successfully completed Phase 1 if:

✅ Smart contract deployed to Sepolia
✅ Contract address in `.env.local`
✅ Pinata credentials configured
✅ Can mint NFT from frontend
✅ NFT appears in dashboard
✅ NFT saved to Supabase
✅ Image loads from IPFS
✅ Transaction visible on Etherscan

---

## 🚀 Next Steps (Phase 2)

After Phase 1 is working:

1. **Replace Mock Data:**
   - Update Explore page to show real NFTs
   - Update Landing page trending section
   - Update NFT Detail page

2. **Add Marketplace:**
   - Buy/sell functionality
   - Listing management
   - Price updates

3. **Real-time Features:**
   - Activity feed from blockchain
   - Live minting notifications
   - Price tracking

---

## 📚 Resources

- **Sepolia Etherscan:** https://sepolia.etherscan.io/
- **Pinata Docs:** https://docs.pinata.cloud/
- **Hardhat Docs:** https://hardhat.org/docs
- **OpenZeppelin:** https://docs.openzeppelin.com/contracts/
- **Ethers.js:** https://docs.ethers.org/v6/

---

## 🆘 Need Help?

If you encounter issues:

1. Check browser console for errors
2. Check Supabase logs
3. Check Etherscan for transaction status
4. Verify all environment variables are set
5. Ensure wallet has enough Sepolia ETH

---

**Ready to mint some chaos! 🔥**
