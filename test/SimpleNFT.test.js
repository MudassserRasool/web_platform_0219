const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('SimpleNFT', function () {
  let SimpleNFT;
  let simpleNFT;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    SimpleNFT = await ethers.getContractFactory('SimpleNFT');
    [owner, addr1, addr2] = await ethers.getSigners();

    simpleNFT = await SimpleNFT.deploy('Simple NFT', 'SNFT', 'https://api.example.com/metadata/');
    await simpleNFT.deployed();
  });

  describe('Deployment', function () {
    it('Should set the right owner', async function () {
      expect(await simpleNFT.owner()).to.equal(owner.address);
    });

    it('Should set the correct name and symbol', async function () {
      expect(await simpleNFT.name()).to.equal('Simple NFT');
      expect(await simpleNFT.symbol()).to.equal('SNFT');
    });
  });

  describe('Minting', function () {
    it('Should allow owner to mint NFTs', async function () {
      await expect(simpleNFT.mintNFT(addr1.address))
        .to.emit(simpleNFT, 'Transfer')
        .withArgs(ethers.constants.AddressZero, addr1.address, 1);

      expect(await simpleNFT.balanceOf(addr1.address)).to.equal(1);
      expect(await simpleNFT.ownerOf(1)).to.equal(addr1.address);
    });

    it('Should not allow non-owner to mint NFTs', async function () {
      await expect(simpleNFT.connect(addr1).mintNFT(addr2.address)).to.be.revertedWith('Ownable: caller is not the owner');
    });

    it('Should increment token IDs correctly', async function () {
      await simpleNFT.mintNFT(addr1.address);
      await simpleNFT.mintNFT(addr2.address);

      expect(await simpleNFT.getCurrentTokenId()).to.equal(2);
      expect(await simpleNFT.ownerOf(1)).to.equal(addr1.address);
      expect(await simpleNFT.ownerOf(2)).to.equal(addr2.address);
    });
  });

  describe('Transfers', function () {
    beforeEach(async function () {
      await simpleNFT.mintNFT(addr1.address);
    });

    it('Should allow token owner to transfer NFT', async function () {
      await expect(simpleNFT.connect(addr1).safeTransferFrom(addr1.address, addr2.address, 1))
        .to.emit(simpleNFT, 'Transfer')
        .withArgs(addr1.address, addr2.address, 1);

      expect(await simpleNFT.ownerOf(1)).to.equal(addr2.address);
    });

    it('Should not allow non-owner to transfer NFT', async function () {
      await expect(simpleNFT.connect(addr2).safeTransferFrom(addr1.address, addr2.address, 1)).to.be.revertedWith(
        'ERC721: caller is not token owner or approved',
      );
    });
  });

  describe('Utility functions', function () {
    it('Should check if token exists', async function () {
      expect(await simpleNFT.exists(1)).to.be.false;

      await simpleNFT.mintNFT(addr1.address);

      expect(await simpleNFT.exists(1)).to.be.true;
      expect(await simpleNFT.exists(2)).to.be.false;
    });
  });
});
