const fs = require('fs');
const path = require('path');

async function main() {
  try {
    // Read the deployment file
    const deploymentPath = path.join(__dirname, '..', 'deployments', 'SimpleNFT-address.json');

    if (!fs.existsSync(deploymentPath)) {
      console.log('❌ No deployment file found. Please deploy the contract first.');
      console.log('Run: npm run deploy');
      return;
    }

    const deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
    const newAddress = deployment.address;

    console.log('📁 Found contract address:', newAddress);

    // Read the constants file
    const constantsPath = path.join(__dirname, '..', 'constants', 'simpleNFT.ts');
    let constantsContent = fs.readFileSync(constantsPath, 'utf8');

    // Update the address using regex
    const addressRegex = /(SIMPLE_NFT_CONTRACT_ADDRESS\s*=\s*process\.env\.NEXT_PUBLIC_SIMPLE_NFT_ADDRESS\s*\|\|\s*)'[^']*'/;
    const replacement = `$1'${newAddress}'`;

    constantsContent = constantsContent.replace(addressRegex, replacement);

    // Write back to file
    fs.writeFileSync(constantsPath, constantsContent);

    console.log('✅ Updated constants/simpleNFT.ts with new contract address');
    console.log('📄 Contract address in constants file:', newAddress);
  } catch (error) {
    console.error('❌ Error updating address:', error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
