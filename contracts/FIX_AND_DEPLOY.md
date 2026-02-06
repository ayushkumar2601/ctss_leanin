# 🔧 FIX AND DEPLOY

## Quick Fix Steps

### 1. Clean Install

```bash
cd contracts

# Remove old dependencies
rm -rf node_modules package-lock.json

# Install fresh
npm install
```

### 2. Deploy

```bash
npm run deploy
```

---

## If Still Having Issues

### Option A: Use CommonJS (Simpler)

Run these commands:

```bash
cd contracts

# Remove type module
npm pkg delete type

# Install compatible versions
npm install --save-dev hardhat@^2.22.0 @nomicfoundation/hardhat-toolbox@^5.0.0 dotenv@^16.4.5

# Deploy
npm run deploy
```

### Option B: Manual Deployment (If all else fails)

Create `contracts/deploy-manual.js`:

```javascript
const hre = require("hardhat");

async function main() {
  console.log("Deploying...");
  
  const NeonChaosNFT = await hre.ethers.getContractFactory("NeonChaosNFT");
  const nft = await NeonChaosNFT.deploy();
  await nft.waitForDeployment();
  
  const address = await nft.getAddress();
  console.log("Contract deployed to:", address);
  console.log("\nAdd to .env.local:");
  console.log(`VITE_CONTRACT_ADDRESS=${address}`);
}

main().catch(console.error);
```

Then run:
```bash
npx hardhat run deploy-manual.js --network sepolia
```

---

## Windows-Specific Commands

If on Windows, use these instead:

```cmd
cd contracts

:: Remove old files
rmdir /s /q node_modules
del package-lock.json

:: Install
npm install

:: Deploy
npm run deploy
```

---

## Verify It Works

After deployment, you should see:

```
✅ Contract deployed successfully!
📍 Contract Address: 0x...
```

Copy that address to `.env.local`!
