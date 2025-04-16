import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/client';
import { verifyVotingToken } from '@/lib/auth';
import { encryptVote, hashFingerprint } from '@/lib/crypto';
import { recordVoteOnBlockchain } from '@/lib/blockchain';
import { headers } from 'next/headers';

// Rate limiting storage (in-memory for demo purposes)
// In production, use Redis or similar for distributed systems
const ipRateLimits: { [key: string]: { count: number; timestamp: number } } = {};
const MAX_REQUESTS_PER_IP = parseInt(process.env.MAX_REQUESTS_PER_IP || '100');
const REQUEST_WINDOW_MS = parseInt(process.env.REQUEST_WINDOW_MS || '3600000'); // 1 hour default

/**
 * Submit a vote
 */
export async function POST(req: NextRequest) {
  try {
    // Get client IP for rate limiting
    const forwardedFor = headers().get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0] : 'unknown';

    // Implement basic rate limiting
    if (ip !== 'unknown') {
      const now = Date.now();
      const ipRateLimit = ipRateLimits[ip] || { count: 0, timestamp: now };
      
      // Reset counter if window has passed
      if (now - ipRateLimit.timestamp > REQUEST_WINDOW_MS) {
        ipRateLimit.count = 0;
        ipRateLimit.timestamp = now;
      }
      
      // Check if rate limit exceeded
      if (ipRateLimit.count >= MAX_REQUESTS_PER_IP) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
      
      // Increment counter
      ipRateLimit.count += 1;
      ipRateLimits[ip] = ipRateLimit;
    }
    
    // Get vote data from request
    const { token, pollId, optionId, fingerprint, captchaToken } = await req.json();
    
    // Validate required fields
    if (!token || !pollId || !optionId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Verify captcha if provided
    if (process.env.HCAPTCHA_SECRET_KEY && !await verifyCaptcha(captchaToken)) {
      return NextResponse.json(
        { error: 'Invalid CAPTCHA' },
        { status: 400 }
      );
    }
    
    // Verify that the poll exists and is active
    const poll = await prisma.poll.findUnique({
      where: {
        id: pollId,
        active: true,
        startDate: { lte: new Date() },
        endDate: { gte: new Date() },
      },
      include: {
        options: true,
      },
    });
    
    if (!poll) {
      return NextResponse.json(
        { error: 'Poll not found or not active' },
        { status: 404 }
      );
    }
    
    // Verify that the option exists in this poll
    const option = poll.options.find(o => o.id === optionId);
    if (!option) {
      return NextResponse.json(
        { error: 'Invalid option for this poll' },
        { status: 400 }
      );
    }
    
    // Verify voting token
    const { valid, token: tokenRecord, message } = await verifyVotingToken(token, pollId);
    
    if (!valid || !tokenRecord) {
      return NextResponse.json(
        { error: message || 'Invalid token' },
        { status: 401 }
      );
    }
    
    // Hash the browser fingerprint for fraud prevention if provided
    const fingerprintHash = fingerprint ? hashFingerprint(fingerprint) : null;
    
    // Check if this fingerprint has already been used for this poll
    if (fingerprintHash) {
      const existingVote = await prisma.vote.findFirst({
        where: {
          pollId,
          fingerprint: fingerprintHash,
        },
      });
      
      if (existingVote) {
        return NextResponse.json(
          { error: 'A vote has already been cast from this browser' },
          { status: 403 }
        );
      }
    }
    
    // Create a vote object and encrypt it
    const voteData = {
      pollId,
      optionId,
      timestamp: new Date().toISOString(),
    };
    
    // Encrypt the vote data 
    const encryptedVote = encryptVote(voteData, 'public-key-placeholder');
    
    // Generate a signature (in a real system, this would be signed by the voter's private key)
    const signature = 'mock-signature-' + Math.random().toString(36).substring(2);
    
    // Record the vote on the blockchain
    const { success, txHash, error } = await recordVoteOnBlockchain(
      pollId,
      encryptedVote,
      signature
    );
    
    if (!success) {
      console.error('Blockchain error:', error);
      // Continue anyway for demo purposes
    }
    
    // Mark the token as used
    await prisma.token.update({
      where: {
        id: tokenRecord.id,
      },
      data: {
        used: true,
        usedAt: new Date(),
      },
    });
    
    // Store the vote in the database
    const vote = await prisma.vote.create({
      data: {
        pollId,
        optionId,
        encryptedVote,
        signature,
        blockchainTx: txHash,
        tokenId: tokenRecord.id,
        fingerprint: fingerprintHash,
      },
    });
    
    return NextResponse.json({
      success: true,
      message: 'Vote recorded successfully',
      voteId: vote.id,
    });
  } catch (error) {
    console.error('Error recording vote:', error);
    return NextResponse.json(
      { error: 'Failed to record vote' },
      { status: 500 }
    );
  }
}

/**
 * Verify a CAPTCHA token with hCaptcha
 */
async function verifyCaptcha(token: string): Promise<boolean> {
  if (!token) return false;
  
  try {
    const hcaptchaSecret = process.env.HCAPTCHA_SECRET_KEY;
    if (!hcaptchaSecret) return true; // Skip verification if no key is set
    
    const response = await fetch('https://hcaptcha.com/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `response=${token}&secret=${hcaptchaSecret}`,
    });
    
    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error('CAPTCHA verification error:', error);
    return false;
  }
} 