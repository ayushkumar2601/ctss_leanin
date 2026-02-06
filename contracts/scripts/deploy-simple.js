const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("🚀 Deploying NEON CHAOS NFT Contract to Sepolia...\n");

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);

  // Check balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH\n");

  if (balance === 0n) {
    console.error("❌ ERROR: Deployer account has no ETH!");
    console.error("Get Sepolia ETH from: https://sepoliafaucet.com/");
    process.exit(1);
  }

  // Deploy contract
  console.log("⏳ Deploying NeonChaosNFT contract...");
  const NeonChaosNFT = await hre.ethers.getContractFactory("NeonChaosNFT");
  const nft = await NeonChaosNFT.deploy();

  await nft.waitForDeployment();
  const contractAddress = await nft.getAddress();

  console.log("\n✅ Contract deployed successfully!");
  console.log("📍 Contract Address:", contractAddress);
  console.log("\n📋 Add this to your .env.local:");
  console.log(`VITE_CONTRACT_ADDRESS=${contractAddress}`);

  console.log("\n🔍 Verify contract on Etherscan:");
  console.log(`npx hardhat verify --network sepolia ${contractAddress}`);

  console.log("\n🌐 View on Sepolia Etherscan:");
  console.log(`https://sepolia.etherscan.io/address/${contractAddress}`);

  // Save deployment info
  const deploymentInfo = {
    contractAddress,
    deployer: deployer.address,
    network: "sepolia",
    chainId: 11155111,
    deployedAt: new Date().toISOString(),
    blockNumber: await hre.ethers.provider.getBlockNumber(),
  };

  fs.writeFileSync(
    "./deployment.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("\n💾 Deployment info saved to contracts/deployment.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });
