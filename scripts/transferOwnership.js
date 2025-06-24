const { ethers } = require('hardhat');

async function main() {
  // Replace with your MetaMask address
  const newOwner = '0xYOUR_METAMASK_ADDRESS_HERE';
  const contractAddress = '0x6270eD6d647B9AC1ea51D296EAeAe6850f50EfAb';

  // Get the contract factory and attach to deployed contract
  const SimpleNFT = await ethers.getContractFactory('SimpleNFT');
  const simpleNFT = SimpleNFT.attach(contractAddress);

  // Get current owner
  const currentOwner = await simpleNFT.owner();
  console.log('Current Owner:', currentOwner);
  console.log('New Owner:', newOwner);

  if (currentOwner.toLowerCase() === newOwner.toLowerCase()) {
    console.log('✅ Address is already the owner!');
    return;
  }

  // Transfer ownership
  console.log('🔄 Transferring ownership...');
  const tx = await simpleNFT.transferOwnership(newOwner);
  await tx.wait();

  // Verify transfer
  const verifyOwner = await simpleNFT.owner();
  console.log('✅ Ownership transferred!');
  console.log('New verified owner:', verifyOwner);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
