import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/client';
import { getUserFromRequest, withAuth } from '@/lib/auth';

// Get a specific poll
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pollId = params.id;
    
    // Get the poll with options
    const poll = await prisma.poll.findUnique({
      where: {
        id: pollId
      },
      include: {
        options: true,
        _count: {
          select: { votes: true }
        }
      }
    });
    
    if (!poll) {
      return NextResponse.json(
        { error: 'Poll not found' },
        { status: 404 }
      );
    }
    
    // For public access, return only necessary information
    // Hide sensitive details like tokens
    return NextResponse.json({
      poll: {
        id: poll.id,
        title: poll.title,
        description: poll.description,
        startDate: poll.startDate,
        endDate: poll.endDate,
        active: poll.active,
        options: poll.options.map(option => ({
          id: option.id,
          text: option.text
        })),
        voteCount: poll._count.votes
      }
    });
  } catch (error) {
    console.error('Error fetching poll:', error);
    return NextResponse.json(
      { error: 'Failed to fetch poll' },
      { status: 500 }
    );
  }
}

// Update a poll (admin only)
export const PUT = withAuth(async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const user = getUserFromRequest(req);
    const pollId = params.id;
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Check if poll exists and belongs to the user
    const existingPoll = await prisma.poll.findUnique({
      where: {
        id: pollId,
      },
    });
    
    if (!existingPoll) {
      return NextResponse.json(
        { error: 'Poll not found' },
        { status: 404 }
      );
    }
    
    if (existingPoll.createdBy !== user.userId) {
      return NextResponse.json(
        { error: 'Unauthorized to update this poll' },
        { status: 403 }
      );
    }
    
    // Get the update data
    const { title, description, active } = await req.json();
    
    // Update the poll
    const updatedPoll = await prisma.poll.update({
      where: {
        id: pollId,
      },
      data: {
        title: title || undefined,
        description: description || undefined,
        active: typeof active === 'boolean' ? active : undefined,
      },
      include: {
        options: true,
      },
    });
    
    return NextResponse.json({ poll: updatedPoll });
  } catch (error) {
    console.error('Error updating poll:', error);
    return NextResponse.json(
      { error: 'Failed to update poll' },
      { status: 500 }
    );
  }
});

// Delete a poll (admin only)
export const DELETE = withAuth(async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const user = getUserFromRequest(req);
    const pollId = params.id;
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Check if poll exists and belongs to the user
    const existingPoll = await prisma.poll.findUnique({
      where: {
        id: pollId,
      },
    });
    
    if (!existingPoll) {
      return NextResponse.json(
        { error: 'Poll not found' },
        { status: 404 }
      );
    }
    
    if (existingPoll.createdBy !== user.userId) {
      return NextResponse.json(
        { error: 'Unauthorized to delete this poll' },
        { status: 403 }
      );
    }
    
    // Delete the poll (Prisma will cascade delete options, votes, and tokens)
    await prisma.poll.delete({
      where: {
        id: pollId,
      },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting poll:', error);
    return NextResponse.json(
      { error: 'Failed to delete poll' },
      { status: 500 }
    );
  }
}); 