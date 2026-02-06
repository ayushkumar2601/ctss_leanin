const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("🚀 Deploying NFT Marketplace to Sepolia...\n");

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);

  // Check balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH\n");

  // Deploy Marketplace
  console.log("⏳ Deploying NFTMarketplace contract...");
  const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketplace");
  const marketplace = await NFTMarketplace.deploy();
  await marketplace.waitForDeployment();

  const marketplaceAddress = await marketplace.getAddress();
  console.log("✅ Marketplace deployed to:", marketplaceAddress);

  // Get platform fee
  const platformFee = await marketplace.platformFee();
  console.log("📊 Platform fee:", platformFee.toString(), "basis points (", Number(platformFee) / 100, "%)");

  // Save deployment info
  const deploymentInfo = {
    network: "sepolia",
    marketplaceAddress: marketplaceAddress,
    deployer: deployer.address,
    platformFee: platformFee.toString(),
    deployedAt: new Date().toISOString(),
    blockNumber: await hre.ethers.provider.getBlockNumber()
  };

  const deploymentPath = path.join(__dirname, '../marketplace-deployment.json');
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log("💾 Deployment info saved to marketplace-deployment.json\n");

  // Instructions
  console.log("📋 Add this to your .env.local:");
  console.log(`VITE_MARKETPLACE_ADDRESS=${marketplaceAddress}\n`);

  console.log("🔍 Verify contract on Etherscan:");
  console.log(`npx hardhat verify --network sepolia ${marketplaceAddress}\n`);

  console.log("🌐 View on Sepolia Etherscan:");
  console.log(`https://sepolia.etherscan.io/address/${marketplaceAddress}\n`);

  console.log("✅ Deployment complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
