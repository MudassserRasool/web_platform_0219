import { simpleNFTABI } from '@/abis';
import { SIMPLE_NFT_CONTRACT_ADDRESS } from '@/constants/simpleNFT';
import { ethers } from 'ethers';
import { useState } from 'react';
import { toast } from 'react-toastify';
import {
  useAccount,
  useConnect,
  useContractRead,
  useContractWrite,
  useDisconnect,
  useNetwork,
  useSwitchNetwork,
  useWaitForTransaction,
} from 'wagmi';

export default function MintPage() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  // Form states
  const [mintRecipient, setMintRecipient] = useState('');
  const [transferTokenId, setTransferTokenId] = useState('');
  const [transferRecipient, setTransferRecipient] = useState('');

  // Debug info
  const currentChainId = chain?.id;
  const expectedChainId = 31337; // Hardhat localhost

  // Contract read for current token ID
  const { data: currentTokenId, error: tokenIdError } = useContractRead({
    address: SIMPLE_NFT_CONTRACT_ADDRESS as `0x${string}`,
    abi: simpleNFTABI,
    functionName: 'getCurrentTokenId',
    enabled: isConnected && currentChainId === expectedChainId,
  });

  // Contract read for contract owner
  const data = useContractRead({
    address: SIMPLE_NFT_CONTRACT_ADDRESS as `0x${string}`,
    abi: simpleNFTABI,
    functionName: 'owner',
    enabled: isConnected && currentChainId === expectedChainId,
  });
  const { data: contractOwner } = data;
  console.log('********************************************');
  console.log('contractOwner and address', contractOwner, ' --------', address);
  console.log('data---------->', JSON.stringify(data));
  console.log('********************************************');

  // Check if connected user is the contract owner
  const isOwner = address && contractOwner && address.toLowerCase() === contractOwner.toLowerCase();

  // Mint NFT contract write
  const {
    data: mintData,
    write: mintNFT,
    error: mintError,
  } = useContractWrite({
    address: SIMPLE_NFT_CONTRACT_ADDRESS as `0x${string}`,
    abi: simpleNFTABI,
    functionName: 'mintNFT',
    onSuccess() {
      toast.success('Mint transaction submitted!');
    },
    onError(error) {
      toast.error(`Mint failed: ${error.message}`);
    },
  });

  // Transfer NFT contract write
  const {
    data: transferData,
    write: transferNFT,
    error: transferError,
  } = useContractWrite({
    address: SIMPLE_NFT_CONTRACT_ADDRESS as `0x${string}`,
    abi: simpleNFTABI,
    functionName: 'safeTransferFrom',
    onSuccess() {
      toast.success('Transfer transaction submitted!');
    },
    onError(error) {
      toast.error(`Transfer failed: ${error.message}`);
    },
  });

  // Wait for mint transaction
  const { isLoading: isMintLoading } = useWaitForTransaction({
    hash: mintData?.hash,
    onSuccess() {
      toast.success('NFT minted successfully!');
      setMintRecipient('');
    },
  });

  // Wait for transfer transaction
  const { isLoading: isTransferLoading } = useWaitForTransaction({
    hash: transferData?.hash,
    onSuccess() {
      toast.success('NFT transferred successfully!');
      setTransferTokenId('');
      setTransferRecipient('');
    },
  });

  // Validate Ethereum address
  const isValidAddress = (addr: string) => {
    try {
      return ethers.utils.isAddress(addr);
    } catch {
      return false;
    }
  };

  // Handle mint NFT
  const handleMint = async () => {
    if (!mintRecipient) {
      toast.error('Please enter a recipient address');
      return;
    }

    if (!isValidAddress(mintRecipient)) {
      toast.error('Please enter a valid Ethereum address');
      return;
    }

    if (!isOwner) {
      toast.error('Only the contract owner can mint NFTs');
      return;
    }

    mintNFT({
      args: [mintRecipient as `0x${string}`],
    });
  };

  // Handle transfer NFT
  const handleTransfer = async () => {
    if (!transferTokenId || !transferRecipient) {
      toast.error('Please enter both token ID and recipient address');
      return;
    }

    if (!isValidAddress(transferRecipient)) {
      toast.error('Please enter a valid Ethereum address');
      return;
    }

    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    transferNFT({
      args: [address, transferRecipient as `0x${string}`, BigInt(transferTokenId)],
    });
  };

  // Connect to MetaMask
  const handleConnect = () => {
    const metaMaskConnector = connectors.find((connector) => connector.name === 'MetaMask');
    if (metaMaskConnector) {
      connect({ connector: metaMaskConnector });
    } else {
      // Fallback to first available connector
      connect({ connector: connectors[0] });
    }
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="backdrop-box rounded-2xl p-8">
        <h1 className="mb-8 text-center text-3xl font-bold">Simple NFT Minter</h1>

        {/* Connection Status */}
        <div className="mb-8 rounded-lg bg-gray-800/50 p-4">
          <h2 className="mb-4 text-xl font-semibold">Wallet Connection</h2>
          {isConnected ? (
            <div className="space-y-2">
              <p className="text-green-400">✅ Connected: {address}</p>
              <p className="text-sm text-gray-400">Contract Owner: {contractOwner || 'Loading...'}</p>
              {isOwner && <p className="text-blue-400">🔑 You are the contract owner</p>}
              <button
                onClick={() => disconnect()}
                className="rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <div>
              <p className="mb-4 text-red-400">❌ Not connected</p>
              <button
                onClick={handleConnect}
                className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Connect MetaMask
              </button>
            </div>
          )}
        </div>

        {/* Contract Info */}
        <div className="mb-8 rounded-lg bg-gray-800/50 p-4">
          <h2 className="mb-4 text-xl font-semibold">Contract Information</h2>
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-gray-400">Contract Address:</span> {SIMPLE_NFT_CONTRACT_ADDRESS}
            </p>
            <p>
              <span className="text-gray-400">Current Token ID:</span> {currentTokenId?.toString() || '0'}
            </p>
          </div>
        </div>

        {/* Mint NFT Section */}
        <div className="mb-8 rounded-lg bg-gray-800/50 p-4">
          <h2 className="mb-4 text-xl font-semibold">Mint NFT</h2>
          {!isOwner && isConnected && <p className="mb-4 text-yellow-400">⚠️ Only the contract owner can mint NFTs</p>}
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Recipient Address:</label>
              <input
                type="text"
                value={mintRecipient}
                onChange={(e) => setMintRecipient(e.target.value)}
                placeholder="0x..."
                className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                disabled={!isConnected || !isOwner}
              />
            </div>
            <button
              onClick={handleMint}
              disabled={!isConnected || !isOwner || isMintLoading || !mintRecipient}
              className="w-full rounded-lg bg-green-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-600"
            >
              {isMintLoading ? 'Minting...' : 'Mint NFT'}
            </button>
          </div>
        </div>

        {/* Transfer NFT Section */}
        <div className="rounded-lg bg-gray-800/50 p-4">
          <h2 className="mb-4 text-xl font-semibold">Transfer NFT</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Token ID:</label>
              <input
                type="number"
                value={transferTokenId}
                onChange={(e) => setTransferTokenId(e.target.value)}
                placeholder="1"
                className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                disabled={!isConnected}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Recipient Address:</label>
              <input
                type="text"
                value={transferRecipient}
                onChange={(e) => setTransferRecipient(e.target.value)}
                placeholder="0x..."
                className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                disabled={!isConnected}
              />
            </div>
            <button
              onClick={handleTransfer}
              disabled={!isConnected || isTransferLoading || !transferTokenId || !transferRecipient}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-600"
            >
              {isTransferLoading ? 'Transferring...' : 'Transfer NFT'}
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 rounded-lg border border-blue-500/50 bg-blue-900/30 p-4">
          <h3 className="mb-2 text-lg font-semibold text-blue-400">Instructions:</h3>
          <ol className="list-inside list-decimal space-y-1 text-sm text-blue-200">
            <li>Connect your MetaMask wallet</li>
            <li>If you&apos;re the contract owner, you can mint NFTs to any address</li>
            <li>Anyone can transfer NFTs they own using the Transfer section</li>
            <li>Make sure you&apos;re connected to the correct network (localhost for development)</li>
          </ol>
        </div>

        {/* Network Switch Warning */}
        {JSON.stringify(currentChainId)}
        <h1>sssssss</h1>
        {JSON.stringify(expectedChainId)}
        {isConnected && currentChainId !== expectedChainId && (
          <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-4">
            <h3 className="mb-2 font-semibold text-red-800">⚠️ Wrong Network</h3>
            <p className="mb-3 text-sm text-red-700">Please switch to Hardhat Local network to interact with the contract.</p>
            {switchNetwork && (
              <button
                onClick={() => switchNetwork(expectedChainId)}
                className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
              >
                Switch to Hardhat Local
              </button>
            )}
          </div>
        )}

        {/* Error Display */}
        {(contractOwner === null || tokenIdError || connectError || mintError || transferError) && (
          <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-4">
            <h3 className="mb-2 font-semibold text-red-800">❌ Errors</h3>
            <div className="space-y-2 text-sm text-red-700">
              {contractOwner === null && (
                <div>
                  <strong>Contract Owner Error:</strong> Unable to fetch contract owner
                </div>
              )}
              {tokenIdError && (
                <div>
                  <strong>Token ID Error:</strong> {tokenIdError.message}
                </div>
              )}
              {connectError && (
                <div>
                  <strong>Connect Error:</strong> {connectError.message}
                </div>
              )}
              {mintError && (
                <div>
                  <strong>Mint Error:</strong> {mintError.message}
                </div>
              )}
              {transferError && (
                <div>
                  <strong>Transfer Error:</strong> {transferError.message}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
