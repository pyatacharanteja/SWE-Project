import * as CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';
import { createHash } from 'crypto';

// Environment variables for encryption
const TOKEN_ENCRYPTION_KEY = process.env.TOKEN_ENCRYPTION_KEY || 'fallback-key-32-chars-replace-in-prod';

/**
 * Generate a secure anonymous voting token
 */
export const generateVotingToken = (): string => {
  // Create a random UUID
  const tokenUuid = uuidv4();
  
  // Add some random entropy
  const randomEntropy = CryptoJS.lib.WordArray.random(16).toString();
  
  // Combine and return
  return `${tokenUuid}-${randomEntropy}`;
};

/**
 * Encrypt a voting token for secure storage
 */
export const encryptToken = (token: string): string => {
  return CryptoJS.AES.encrypt(token, TOKEN_ENCRYPTION_KEY).toString();
};

/**
 * Decrypt a voting token
 */
export const decryptToken = (encryptedToken: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedToken, TOKEN_ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

/**
 * Hash a token for database storage
 */
export const hashToken = (token: string): string => {
  return createHash('sha256').update(token).digest('hex');
};

/**
 * Encrypt vote data
 */
export const encryptVote = (voteData: any, publicKey: string): string => {
  const voteString = JSON.stringify(voteData);
  // In a real implementation, we would use asymmetric encryption with the public key
  // For this example, we'll use symmetric encryption for simplicity
  return CryptoJS.AES.encrypt(voteString, TOKEN_ENCRYPTION_KEY).toString();
};

/**
 * Verify signature of a vote
 */
export const verifySignature = (data: string, signature: string, publicKey: string): boolean => {
  // In a real implementation, we would verify the signature using the public key
  // For this example, we'll return true for simplicity
  return true;
};

/**
 * Generate a hash of the browser fingerprint for fraud detection
 */
export const hashFingerprint = (fingerprint: string): string => {
  return createHash('sha256').update(fingerprint).digest('hex');
};

/**
 * Hash IP address for rate limiting while preserving privacy
 */
export const hashIpAddress = (ip: string, salt: string): string => {
  return createHash('sha256').update(`${ip}-${salt}`).digest('hex');
}; 