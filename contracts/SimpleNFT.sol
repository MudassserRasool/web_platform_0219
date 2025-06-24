// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title SimpleNFT
 * @dev A simple ERC721 NFT contract with minting functionality
 */
contract SimpleNFT is ERC721, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIds;
    
    // Optional: You can add a base URI for metadata
    string private _baseTokenURI;
    
    constructor(
        string memory name,
        string memory symbol,
        string memory baseTokenURI
    ) ERC721(name, symbol) {
        _baseTokenURI = baseTokenURI;
    }
    
    /**
     * @dev Mint a new NFT to the specified recipient
     * @param recipient The address that will receive the NFT
     * @return The token ID of the newly minted NFT
     */
    function mintNFT(address recipient) public onlyOwner returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        _safeMint(recipient, newTokenId);
        
        return newTokenId;
    }
    
    /**
     * @dev Get the current token count
     * @return The total number of tokens minted
     */
    function getCurrentTokenId() public view returns (uint256) {
        return _tokenIds.current();
    }
    
    /**
     * @dev Set the base URI for token metadata
     * @param baseTokenURI The new base URI
     */
    function setBaseURI(string memory baseTokenURI) public onlyOwner {
        _baseTokenURI = baseTokenURI;
    }
    
    /**
     * @dev Override to return the base URI
     */
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }
    
    /**
     * @dev Check if a token exists
     * @param tokenId The token ID to check
     * @return Whether the token exists
     */
    function exists(uint256 tokenId) public view returns (bool) {
        return _exists(tokenId);
    }
} 