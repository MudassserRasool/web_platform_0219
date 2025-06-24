# SimpleNFT Contract Integration

This document explains how to set up and use the SimpleNFT contract that has been integrated into the P12 project.

## Overview

The SimpleNFT contract is a minimal ERC-721 implementation that allows:

- Contract owner to mint NFTs to any address
- Token holders to transfer their NFTs using `safeTransferFrom`
- Simple incrementing token IDs
- OpenZeppelin's security and standard compliance

## Prerequisites

- Node.js installed
- MetaMask or compatible wallet
- Hardhat development environment

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

### 2. Compile the Contract

```bash
npm run compile
# or
npx hardhat compile
```

### 3. Start Local Blockchain

```bash
npx hardhat node
```

This will start a local Hardhat network on `http://localhost:8545` with 20 pre-funded accounts.

### 4. Deploy the Contract

In a new terminal:

```bash
npm run deploy
# or
npx hardhat run scripts/deploy.js --network localhost
```

The deployment script will:

- Deploy the SimpleNFT contract
- Save the contract address to `deployments/SimpleNFT-address.json`
- Save the ABI to `deployments/SimpleNFT.json`
- Log the deployed contract address

### 5. Configure MetaMask

1. Open MetaMask
2. Add a new network with these settings:

   - Network Name: Hardhat Local
   - RPC URL: http://localhost:8545
   - Chain ID: 31337
   - Currency Symbol: ETH

3. Import one of the private keys from the Hardhat node output to have funds for testing.

### 6. Update Contract Address (if needed)

If you deploy to a different network, update the contract address in:

- `constants/simpleNFT.ts`
- Or set the environment variable `NEXT_PUBLIC_SIMPLE_NFT_ADDRESS`

## Usage

### Access the Mint Page

1. Start the Next.js development server:

```bash
npm run dev
```

2. Navigate to `http://localhost:3000/mint`

### Features Available

#### Wallet Connection

- Connect/disconnect MetaMask wallet
- Display connection status and address
- Show contract owner information

#### Mint NFT (Owner Only)

- Enter recipient address
- Click "Mint NFT" to create a new token
- Only the contract owner can mint

#### Transfer NFT

- Enter token ID and recipient address
- Click "Transfer NFT" to transfer ownership
- Only token owners can transfer their NFTs

### Contract Functions

#### Read Functions

- `getCurrentTokenId()`: Get the last minted token ID
- `owner()`: Get the contract owner address
- `ownerOf(tokenId)`: Get the owner of a specific token
- `balanceOf(address)`: Get number of tokens owned by an address
- `exists(tokenId)`: Check if a token exists

#### Write Functions

- `mintNFT(recipient)`: Mint new NFT to recipient (owner only)
- `safeTransferFrom(from, to, tokenId)`: Transfer NFT safely
- `transferFrom(from, to, tokenId)`: Transfer NFT
- `approve(to, tokenId)`: Approve address to transfer specific token
- `setApprovalForAll(operator, approved)`: Approve operator for all tokens

## Testing

Run the contract tests:

```bash
npm run test
# or
npx hardhat test
```

The tests cover:

- Contract deployment
- Minting functionality
- Access control (owner-only minting)
- Transfer functionality
- Utility functions

## File Structure

```
├── contracts/
│   └── SimpleNFT.sol          # Main NFT contract
├── scripts/
│   └── deploy.js              # Deployment script
├── test/
│   └── SimpleNFT.test.js      # Contract tests
├── abis/
│   ├── simpleNFT.ts           # Contract ABI for frontend
│   └── index.ts               # ABI exports
├── constants/
│   └── simpleNFT.ts           # Contract configuration
├── pages/
│   └── mint.tsx               # Mint page UI
├── deployments/               # Generated deployment files
├── hardhat.config.js          # Hardhat configuration
└── NFT_SETUP.md              # This file
```

## Security Considerations

- Only the contract owner can mint NFTs
- All transfers use `safeTransferFrom` for safety
- OpenZeppelin contracts provide battle-tested security
- Input validation on the frontend prevents common errors

## Troubleshooting

### Common Issues

1. **Transaction fails**: Make sure you're connected to the correct network
2. **"Only owner can mint"**: Ensure the connected wallet is the contract owner
3. **Contract not found**: Verify the contract address in `constants/simpleNFT.ts`
4. **Network issues**: Check that Hardhat node is running on port 8545

### Reset Local Environment

If you need to reset:

1. Stop the Hardhat node (Ctrl+C)
2. Delete `cache/` and `artifacts/` folders
3. Restart with `npx hardhat node`
4. Redeploy the contract

## Integration with Existing Project

The NFT functionality has been carefully integrated to avoid conflicts:

- Uses existing Web3 infrastructure (Wagmi)
- Follows existing styling patterns
- Uses existing toast notifications
- Maintains the same component structure
- Separate page route (`/mint`) doesn't interfere with existing functionality

## Next Steps

You can extend this implementation by:

- Adding metadata support (images, descriptions)
- Implementing batch minting
- Adding role-based access control
- Creating a marketplace interface
- Integrating with IPFS for decentralized metadata storage
