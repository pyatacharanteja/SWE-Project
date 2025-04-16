import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/db/client';
import { generateUserJwt, hashPassword } from '@/lib/auth';

// Login endpoint
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    // Check if user exists and password is correct
    if (!user || user.password !== hashPassword(password)) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    // Generate JWT
    const token = generateUserJwt({
      userId: user.id,
      email: user.email,
      name: user.name || undefined
    });
    
    // Set JWT as HttpOnly cookie
    cookies().set({
      name: 'auth-token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });
    
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Logout endpoint
export async function DELETE() {
  try {
    // Clear auth cookie
    cookies().delete('auth-token');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Check auth status
export async function GET() {
  try {
    const token = cookies().get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json({ authenticated: false });
    }
    
    return NextResponse.json({ authenticated: true });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 