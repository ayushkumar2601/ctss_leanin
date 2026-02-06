// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title NeonChaosNFT
 * @dev ERC-721 NFT contract for NEON CHAOS marketplace
 * @notice Production-ready NFT contract with auto-incrementing token IDs
 */
contract NeonChaosNFT is ERC721, ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    // Events
    event Minted(
        address indexed owner,
        uint256 indexed tokenId,
        string tokenURI,
        uint256 timestamp
    );

    constructor() ERC721("NEON CHAOS", "CHAOS") Ownable(msg.sender) {
        _nextTokenId = 1; // Start token IDs at 1
    }

    /**
     * @dev Mint a new NFT with metadata URI
     * @param to Address to mint NFT to
     * @param uri IPFS metadata URI (ipfs://...)
     * @return tokenId The minted token ID
     */
    function mintNFT(address to, string memory uri) 
        public 
        returns (uint256) 
    {
        require(to != address(0), "Cannot mint to zero address");
        require(bytes(uri).length > 0, "URI cannot be empty");

        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        emit Minted(to, tokenId, uri, block.timestamp);

        return tokenId;
    }

    /**
     * @dev Get the current token ID counter
     * @return The next token ID to be minted
     */
    function getCurrentTokenId() public view returns (uint256) {
        return _nextTokenId;
    }

    /**
     * @dev Get total supply of minted NFTs
     * @return Total number of NFTs minted
     */
    function totalSupply() public view returns (uint256) {
        return _nextTokenId - 1;
    }

    // Required overrides
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
