// SimpleNFT Contract Configuration
export const SIMPLE_NFT_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_SIMPLE_NFT_ADDRESS || '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'; // Default localhost address

export const SIMPLE_NFT_CONTRACT_CONFIG = {
  name: 'Simple NFT',
  symbol: 'SNFT',
  description: 'A simple ERC-721 NFT contract for minting and transferring NFTs',
} as const;
