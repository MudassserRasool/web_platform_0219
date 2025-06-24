const { ethers } = require('hardhat');
const fs = require('fs');
const path = require('path');

async function main() {
  // Get the ContractFactory and Signers here.
  const [deployer] = await ethers.getSigners();

  console.log('Deploying contracts with the account:', deployer.address);
  console.log('Account balance:', (await deployer.getBalance()).toString());

  // Deploy the SimpleNFT contract
  const SimpleNFT = await ethers.getContractFactory('SimpleNFT');
  const simpleNFT = await SimpleNFT.deploy(
    'Simple NFT',
    'SNFT',
    'https://api.example.com/metadata/', // Base URI for metadata
  );

  await simpleNFT.deployed();

  console.log('SimpleNFT deployed to:', simpleNFT.address);
  console.log('Contract owner:', await simpleNFT.owner());

  // Optional: Transfer ownership to a specific address
  // Uncomment and replace with your MetaMask address if needed
  // const newOwner = "0xYourMetaMaskAddress";
  // await simpleNFT.transferOwnership(newOwner);
  // console.log('Ownership transferred to:', newOwner);

  // Save the contract address and ABI to files for frontend use
  const contractsDir = path.join(__dirname, '..', 'deployments');

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  // Save contract address
  fs.writeFileSync(
    path.join(contractsDir, 'SimpleNFT-address.json'),
    JSON.stringify({ address: simpleNFT.address }, undefined, 2),
  );

  // Get and save the ABI
  const SimpleNFTArtifact = await ethers.getContractFactory('SimpleNFT');
  fs.writeFileSync(
    path.join(contractsDir, 'SimpleNFT.json'),
    JSON.stringify(SimpleNFTArtifact.interface.format(ethers.utils.FormatTypes.json), null, 2),
  );

  console.log('Contract address and ABI saved to deployments folder');
  console.log('\n📝 Next steps:');
  console.log('1. Import this private key to MetaMask to become the contract owner:');
  console.log('   Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80');
  console.log('2. Or update the contract address in constants/simpleNFT.ts if redeploying');
  console.log('3. Make sure MetaMask is connected to Hardhat Local network (Chain ID: 31337)');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
