import { ethers } from 'ethers';

// Smart Contract ABI (simplified for this example)
const CONTRACT_ABI = [
  'function recordVote(string pollId, string voteHash, string voterProof) public returns (string)',
  'function getVoteCount(string pollId) public view returns (uint256)',
  'function verifyVote(string pollId, string voteHash) public view returns (bool)'
];

// Environment variables for blockchain configuration
const ETHEREUM_PROVIDER_URL = process.env.ETHEREUM_PROVIDER_URL || '';
const ETHEREUM_PRIVATE_KEY = process.env.ETHEREUM_PRIVATE_KEY || '';
const ETHEREUM_CONTRACT_ADDRESS = process.env.ETHEREUM_CONTRACT_ADDRESS || '';

// Create a provider and signer
let provider: ethers.Provider;
let signer: ethers.Signer;
let contract: ethers.Contract;

// Initialize blockchain connection
export const initBlockchain = async () => {
  try {
    if (!ETHEREUM_PROVIDER_URL || !ETHEREUM_PRIVATE_KEY || !ETHEREUM_CONTRACT_ADDRESS) {
      console.warn('Blockchain environment variables not set, running in mock mode');
      return false;
    }

    provider = new ethers.JsonRpcProvider(ETHEREUM_PROVIDER_URL);
    signer = new ethers.Wallet(ETHEREUM_PRIVATE_KEY, provider);
    contract = new ethers.Contract(ETHEREUM_CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    
    return true;
  } catch (error) {
    console.error('Failed to initialize blockchain connection:', error);
    return false;
  }
};

/**
 * Record a vote on the blockchain
 */
export const recordVoteOnBlockchain = async (
  pollId: string,
  voteHash: string,
  voterProof: string
): Promise<{ success: boolean; txHash?: string; error?: string }> => {
  try {
    // Check if blockchain is initialized
    if (!contract) {
      const initialized = await initBlockchain();
      if (!initialized) {
        console.log('Using mock blockchain for development');
        return {
          success: true,
          txHash: `mock-tx-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
        };
      }
    }
    
    // Record vote on the blockchain
    const tx = await contract.recordVote(pollId, voteHash, voterProof);
    const receipt = await tx.wait();
    
    return {
      success: true,
      txHash: receipt.hash
    };
  } catch (error: any) {
    console.error('Error recording vote on blockchain:', error);
    return {
      success: false,
      error: error.message || 'Unknown blockchain error'
    };
  }
};

/**
 * Verify a vote on the blockchain
 */
export const verifyVoteOnBlockchain = async (
  pollId: string,
  voteHash: string
): Promise<boolean> => {
  try {
    // Check if blockchain is initialized
    if (!contract) {
      const initialized = await initBlockchain();
      if (!initialized) {
        console.log('Using mock blockchain for development');
        return true;
      }
    }
    
    // Verify the vote
    return await contract.verifyVote(pollId, voteHash);
  } catch (error) {
    console.error('Error verifying vote on blockchain:', error);
    return false;
  }
};

/**
 * Get the vote count for a poll from the blockchain
 */
export const getVoteCountFromBlockchain = async (pollId: string): Promise<number> => {
  try {
    // Check if blockchain is initialized
    if (!contract) {
      const initialized = await initBlockchain();
      if (!initialized) {
        console.log('Using mock blockchain for development');
        return 0;
      }
    }
    
    // Get the vote count
    const count = await contract.getVoteCount(pollId);
    return Number(count);
  } catch (error) {
    console.error('Error getting vote count from blockchain:', error);
    return 0;
  }
}; 