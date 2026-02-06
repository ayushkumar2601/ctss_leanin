# 🚀 FINAL DEPLOYMENT INSTRUCTIONS

## ✅ Issue Fixed!

The problem was `hardhat.config.js` was pointing to the wrong folder. It's now fixed.

---

## 🎯 DEPLOY NOW (Choose One Method)

### Method 1: Automated Script (EASIEST)

```cmd
cd contracts
CLEAN_AND_DEPLOY.bat
```

This will:
1. Clean old cache
2. Compile contract
3. Deploy to Sepolia
4. Show you the contract address

---

### Method 2: Manual Commands

```cmd
cd contracts

:: Clean cache
rmdir /s /q cache
rmdir /s /q artifacts

:: Compile
npm run compile

:: Deploy
npm run deploy
```

---

## ✅ What You Should See

### During Compilation:
```
Compiled 1 Solidity file successfully
```

### During Deployment:
```
🚀 Deploying NEON CHAOS NFT Contract to Sepolia...

📝 Deploying with account: 0x1234...5678
💰 Account balance: 0.5 ETH

⏳ Deploying NeonChaosNFT contract...

✅ Contract deployed successfully!
📍 Contract Address: 0x9876543210abcdef9876543210abcdef98765432

📋 Add this to your .env.local:
VITE_CONTRACT_ADDRESS=0x9876543210abcdef9876543210abcdef98765432
```

---

## 📋 After Deployment

1. **Copy the contract address** (the long 0x... string)

2. **Open `.env.local`** in your ROOT folder (not contracts folder)

3. **Find this line:**
   ```
   VITE_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
   ```

4. **Replace with your address:**
   ```
   VITE_CONTRACT_ADDRESS=0x9876543210abcdef9876543210abcdef98765432
   ```

5. **Save the file**

6. **Restart your dev server:**
   ```cmd
   npm run dev
   ```

---

## 🧪 Test Minting

1. Open http://localhost:5173
2. Connect your wallet
3. Go to "MINT" page
4. Upload an image
5. Fill in title and description
6. Click "MINT YOUR CHAOS"
7. Approve the transaction in MetaMask
8. Wait ~20 seconds
9. Success! 🎉

---

## 🆘 If You Still Get Errors

### Error: "Cannot find module"
```cmd
npm install
```

### Error: "Invalid private key"
Check `.env.local` - make sure `DEPLOYER_PRIVATE_KEY` starts with `0x`

### Error: "Insufficient funds"
Get Sepolia ETH from: https://sepoliafaucet.com/

### Error: "Network error"
Check `.env.local` - make sure `VITE_RPC_URL` is correct

### Error: Still about node_modules
```cmd
:: Delete everything and start fresh
rmdir /s /q node_modules
rmdir /s /q cache
rmdir /s /q artifacts
del package-lock.json
npm install
npm run deploy
```

---

## 📁 Correct Folder Structure

Your contracts folder should look like this:

```
contracts/
├── contracts/              ← Your Solidity files
│   └── NeonChaosNFT.sol   ← The contract
├── scripts/
│   └── deploy-simple.js
├── hardhat.config.js       ← Config (sources: "./contracts")
├── package.json
└── node_modules/           ← Dependencies (not compiled)
```

---

## ✅ Ready!

The config is fixed. Just run:

```cmd
cd contracts
CLEAN_AND_DEPLOY.bat
```

Or manually:

```cmd
cd contracts
npm run deploy
```

🚀 Good luck!
