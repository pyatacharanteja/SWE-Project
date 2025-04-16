import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/client';
import { getUserFromRequest } from '@/lib/auth';

/**
 * Get poll results
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pollId = params.id;
    const user = getUserFromRequest(req);
    
    // Find the poll
    const poll = await prisma.poll.findUnique({
      where: {
        id: pollId,
      },
      include: {
        options: true,
      },
    });
    
    if (!poll) {
      return NextResponse.json(
        { error: 'Poll not found' },
        { status: 404 }
      );
    }
    
    // Check if poll is still active and user is not the creator
    const pollActive = new Date() < poll.endDate && poll.active;
    const isCreator = user && user.userId === poll.createdBy;
    
    // If poll is active and user is not the creator, don't show results
    if (pollActive && !isCreator) {
      return NextResponse.json(
        { error: 'Results cannot be viewed until the poll has ended' },
        { status: 403 }
      );
    }
    
    // Get vote counts for each option
    const optionResults = await Promise.all(
      poll.options.map(async (option) => {
        const count = await prisma.vote.count({
          where: {
            pollId,
            optionId: option.id,
          },
        });
        
        return {
          id: option.id,
          text: option.text,
          votes: count,
        };
      })
    );
    
    // Get total vote count
    const totalVotes = optionResults.reduce((sum, option) => sum + option.votes, 0);
    
    // Calculate percentages
    const resultsWithPercentages = optionResults.map(option => ({
      ...option,
      percentage: totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0,
    }));
    
    // Sort by vote count (highest first)
    resultsWithPercentages.sort((a, b) => b.votes - a.votes);
    
    return NextResponse.json({
      poll: {
        id: poll.id,
        title: poll.title,
        description: poll.description,
        active: poll.active,
        startDate: poll.startDate,
        endDate: poll.endDate,
      },
      results: {
        options: resultsWithPercentages,
        totalVotes,
      },
    });
  } catch (error) {
    console.error('Error fetching poll results:', error);
    return NextResponse.json(
      { error: 'Failed to fetch poll results' },
      { status: 500 }
    );
  }
} 