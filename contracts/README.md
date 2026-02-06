# NEON CHAOS NFT Smart Contract

Production-ready ERC-721 NFT contract for the NEON CHAOS marketplace.

## Contract Details

- **Standard:** ERC-721 (NFT)
- **Extensions:** ERC721URIStorage, Ownable
- **Network:** Ethereum Sepolia Testnet
- **Compiler:** Solidity ^0.8.20
- **Dependencies:** OpenZeppelin Contracts v5.0.1

## Features

- ✅ Auto-incrementing token IDs
- ✅ IPFS metadata storage
- ✅ Safe minting pattern
- ✅ Ownership management
- ✅ Event emission for indexing
- ✅ Gas optimized

## Installation

```bash
npm install
```

## Deployment

### 1. Configure Environment

Add to `../.env.local`:

```bash
VITE_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
DEPLOYER_PRIVATE_KEY=your_private_key_here
```

### 2. Deploy to Sepolia

```bash
npm run deploy
```

### 3. Verify on Etherscan (Optional)

```bash
npx hardhat verify --network sepolia YOUR_CONTRACT_ADDRESS
```

## Contract Functions

### Public Functions

#### `mintNFT(address to, string memory uri)`
Mints a new NFT with metadata URI.

**Parameters:**
- `to`: Address to mint NFT to
- `uri`: IPFS metadata URI (ipfs://...)

**Returns:** Token ID

**Emits:** `Minted(address owner, uint256 tokenId, string tokenURI, uint256 timestamp)`

#### `tokenURI(uint256 tokenId)`
Returns the metadata URI for a token.

#### `ownerOf(uint256 tokenId)`
Returns the owner address of a token.

#### `totalSupply()`
Returns total number of minted NFTs.

#### `getCurrentTokenId()`
Returns the next token ID to be minted.

## Events

### `Minted`
```solidity
event Minted(
    address indexed owner,
    uint256 indexed tokenId,
    string tokenURI,
    uint256 timestamp
);
```

Emitted when a new NFT is minted.

## Security

- Uses OpenZeppelin's audited contracts
- SafeMint pattern prevents reentrancy
- Input validation on all functions
- Ownable for access control

## Gas Costs (Estimated)

- **Deployment:** ~2,500,000 gas (~0.01 ETH on Sepolia)
- **Mint:** ~150,000 gas (~0.005 ETH on Sepolia)

## Testing

```bash
# Compile contracts
npm run compile

# Run tests (when added)
npx hardhat test
```

## Deployment Info

After deployment, contract info is saved to `deployment.json`:

```json
{
  "contractAddress": "0x...",
  "deployer": "0x...",
  "network": "sepolia",
  "chainId": 11155111,
  "deployedAt": "2024-01-01T00:00:00.000Z",
  "blockNumber": 12345678
}
```

## Mainnet Deployment

⚠️ **Before deploying to mainnet:**

1. Audit the contract
2. Test extensively on testnet
3. Use a hardware wallet for deployment
4. Set up multi-sig for ownership
5. Consider upgradeability patterns

## License

MIT
