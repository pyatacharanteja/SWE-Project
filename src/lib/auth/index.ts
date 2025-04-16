import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { createHash } from 'crypto';
import prisma from '../db/client';
import { hashToken, decryptToken } from '../crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-jwt-secret-replace-in-prod';

/**
 * User authentication types
 */
export interface UserJwtPayload {
  userId: string;
  email: string;
  name?: string;
}

export interface TokenJwtPayload {
  tokenId: string;
  pollId: string;
}

/**
 * Generate a JWT for authenticated users
 */
export const generateUserJwt = (user: UserJwtPayload): string => {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
};

/**
 * Generate a JWT for anonymous voting tokens
 */
export const generateTokenJwt = (payload: TokenJwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};

/**
 * Verify a JWT and return the payload
 */
export const verifyJwt = <T>(token: string): T | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as T;
  } catch (error) {
    return null;
  }
};

/**
 * Get the user from a request
 */
export const getUserFromRequest = (req: NextRequest): UserJwtPayload | null => {
  const token = req.cookies.get('auth-token')?.value;
  if (!token) return null;
  
  return verifyJwt<UserJwtPayload>(token);
};

/**
 * Verify a voting token for poll access
 */
export const verifyVotingToken = async (
  tokenString: string,
  pollId: string
): Promise<{ valid: boolean; token?: any; message?: string }> => {
  try {
    // Hash the token to find it in the database
    const hashedToken = hashToken(tokenString);
    
    // Find the token in the database
    const token = await prisma.token.findFirst({
      where: {
        token: hashedToken,
        pollId: pollId,
        used: false,
        expiresAt: {
          gt: new Date(),
        },
      },
    });
    
    if (!token) {
      return { valid: false, message: 'Invalid or expired token' };
    }
    
    return { valid: true, token };
  } catch (error) {
    console.error('Token verification error:', error);
    return { valid: false, message: 'Token verification failed' };
  }
};

/**
 * Hash a password for secure storage
 */
export const hashPassword = (password: string): string => {
  return createHash('sha256').update(password).digest('hex');
};

/**
 * Middleware to protect admin routes
 */
export const withAuth = (handler: Function) => {
  return async (req: NextRequest) => {
    const user = getUserFromRequest(req);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    return handler(req, user);
  };
}; 