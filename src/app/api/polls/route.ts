import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/client';
import { getUserFromRequest, withAuth } from '@/lib/auth';
import { generateVotingToken, hashToken } from '@/lib/crypto';

// Get all polls (admin only)
export const GET = withAuth(async (req: NextRequest) => {
  try {
    const user = getUserFromRequest(req);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const polls = await prisma.poll.findMany({
      where: {
        createdBy: user.userId
      },
      include: {
        options: true,
        _count: {
          select: { votes: true, tokens: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json({ polls });
  } catch (error) {
    console.error('Error fetching polls:', error);
    return NextResponse.json(
      { error: 'Failed to fetch polls' },
      { status: 500 }
    );
  }
});

// Create a new poll
export const POST = withAuth(async (req: NextRequest) => {
  try {
    const user = getUserFromRequest(req);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const {
      title,
      description,
      options,
      startDate,
      endDate,
      numberOfTokens
    } = await req.json();
    
    // Validate required fields
    if (!title || !description || !options || !options.length || !startDate || !endDate || !numberOfTokens) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Validate options format
    if (!Array.isArray(options) || options.length < 2) {
      return NextResponse.json(
        { error: 'At least two options are required' },
        { status: 400 }
      );
    }
    
    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      );
    }
    
    if (end <= start) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      );
    }
    
    // Create the poll with options
    const newPoll = await prisma.poll.create({
      data: {
        title,
        description,
        startDate: start,
        endDate: end,
        createdBy: user.userId,
        options: {
          create: options.map((text: string) => ({ text }))
        }
      },
      include: {
        options: true
      }
    });
    
    // Generate voting tokens for the poll
    const tokens = [];
    const expiresAt = new Date(end.getTime() + (24 * 60 * 60 * 1000)); // 1 day after end
    
    for (let i = 0; i < numberOfTokens; i++) {
      const rawToken = generateVotingToken();
      const hashedToken = hashToken(rawToken);
      
      tokens.push({
        token: rawToken,
        hashed: hashedToken
      });
      
      // Store hashed token in database
      await prisma.token.create({
        data: {
          pollId: newPoll.id,
          token: hashedToken,
          expiresAt
        }
      });
    }
    
    return NextResponse.json({
      poll: newPoll,
      tokens: tokens.map(t => t.token)
    });
  } catch (error) {
    console.error('Error creating poll:', error);
    return NextResponse.json(
      { error: 'Failed to create poll' },
      { status: 500 }
    );
  }
}); 