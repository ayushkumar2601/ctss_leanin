# ⚡ QUICK START - Phase 1 Minting

Get your NFT minting system running in 10 minutes.

---

## ✅ Checklist

### 1. Get Sepolia ETH (5 min)
- [ ] Visit https://sepoliafaucet.com/
- [ ] Enter your wallet address
- [ ] Get 0.1 ETH (enough for deployment + minting)

### 2. Get Pinata Keys (3 min)
- [ ] Go to https://www.pinata.cloud/
- [ ] Sign up (free)
- [ ] API Keys → New Key
- [ ] Enable `pinFileToIPFS` and `pinJSONToIPFS`
- [ ] Copy API Key and Secret

### 3. Configure .env.local (1 min)
```bash
# Add these to .env.local:
VITE_PINATA_API_KEY=your_key_here
VITE_PINATA_SECRET=your_secret_here
DEPLOYER_PRIVATE_KEY=your_metamask_private_key
```

### 4. Deploy Contract (2 min)
```bash
cd contracts
npm install
npm run deploy
```

Copy the contract address from output.

### 5. Update .env.local (1 min)
```bash
VITE_CONTRACT_ADDRESS=0x... # paste address here
```

### 6. Start App (1 min)
```bash
npm run dev
```

### 7. Test Mint (2 min)
- [ ] Open http://localhost:5173
- [ ] Connect wallet
- [ ] Go to Mint page
- [ ] Upload image
- [ ] Fill title
- [ ] Click "MINT YOUR CHAOS"
- [ ] Approve transaction
- [ ] Wait for success!

---

## 🎉 Done!

Your NFT should now appear in:
- ✅ Dashboard
- ✅ Supabase database
- ✅ Sepolia Etherscan

---

## 🆘 Issues?

See `DEPLOYMENT_GUIDE.md` for detailed troubleshooting.
