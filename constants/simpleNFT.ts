// SimpleNFT Contract Configuration
export const SIMPLE_NFT_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_SIMPLE_NFT_ADDRESS || '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853'; // Default localhost address

export const SIMPLE_NFT_CONTRACT_CONFIG = {
  name: 'Simple NFT',
  symbol: 'SNFT',
  description: 'A simple ERC-721 NFT contract for minting and transferring NFTs',
} as const;

// private = ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
// public = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
