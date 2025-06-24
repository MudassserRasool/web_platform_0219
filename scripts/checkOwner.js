const { ethers } = require('hardhat');
const fs = require('fs');
const path = require('path');

async function main() {
  let contractAddress;

  // Try to get contract address from deployments folder
  try {
    const deploymentPath = path.join(__dirname, '..', 'deployments', 'SimpleNFT-address.json');
    if (fs.existsSync(deploymentPath)) {
      const deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
      contractAddress = deployment.address;
      console.log('📁 Found deployed contract address:', contractAddress);
    } else {
      console.log('❌ No deployment file found. Please deploy the contract first.');
      console.log('Run: npm run deploy');
      return;
    }
  } catch (error) {
    console.log('❌ Error reading deployment file:', error.message);
    console.log('Run: npm run deploy');
    return;
  }

  // Get the contract factory
  const SimpleNFT = await ethers.getContractFactory('SimpleNFT');

  // Connect to the deployed contract
  const simpleNFT = SimpleNFT.attach(contractAddress);

  try {
    // Check if contract exists by calling a view function
    const code = await ethers.provider.getCode(contractAddress);
    if (code === '0x') {
      console.log('❌ No contract deployed at this address.');
      console.log('Please run: npm run deploy');
      return;
    }

    // Get the current owner
    const owner = await simpleNFT.owner();
    console.log('\n📋 Contract Information:');
    console.log('Contract Address:', contractAddress);
    console.log('Current Owner:', owner);
    console.log('Current Token ID:', (await simpleNFT.getCurrentTokenId()).toString());

    // Get available accounts
    const [deployer] = await ethers.getSigners();
    console.log('\n👤 Available Accounts:');
    console.log('Deployer Account:', deployer.address);
    console.log('Is Deployer the Owner?', deployer.address.toLowerCase() === owner.toLowerCase());

    console.log('\n🔑 Default Hardhat Account Private Key:');
    console.log('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80');

    console.log('\n📝 Next Steps:');
    console.log('1. Import the private key above to MetaMask');
    console.log('2. Switch to that account in MetaMask');
    console.log('3. Make sure MetaMask is connected to "Hardhat Local" network');
    console.log('4. Update constants/simpleNFT.ts with the contract address if needed');
  } catch (error) {
    console.error('❌ Error calling contract:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure Hardhat node is running: npx hardhat node');
    console.log('2. Deploy the contract: npm run deploy');
    console.log('3. Check network connection');
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
