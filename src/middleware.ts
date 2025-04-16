import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;
  
  // Debug all cookies
  console.log('Middleware cookies:', Object.fromEntries(request.cookies.getAll().map(c => [c.name, c.value])));

  // Check if user is logged in (using cookies)
  const isLoggedIn = request.cookies.get('isLoggedIn')?.value === 'true';
  const isAdmin = request.cookies.get('isAdmin')?.value === 'true';
  
  console.log(`Middleware check: Path=${path}, LoggedIn=${isLoggedIn}, Admin=${isAdmin}`);
  
  // Skip auth check for public routes, but redirect if already logged in
  if (path === '/' || path === '/login' || path.startsWith('/_next') || path.startsWith('/api')) {
    // If already logged in and trying to access login page or home page, redirect to welcome
    if (isLoggedIn && (path === '/login' || path === '/')) {
      console.log('Already logged in, redirecting from login/home page');
      return NextResponse.redirect(new URL('/welcome', request.url));
    }
    return NextResponse.next();
  }
  
  // For protected routes
  if (!isLoggedIn) {
    console.log('Not logged in, redirecting to login');
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Welcome page is accessible to both admin and users
  if (path === '/welcome') {
    return NextResponse.next();
  }
  
  // Role-based access control - Only restrict regular users from dashboard
  if (!isAdmin && path.startsWith('/dashboard')) {
    console.log('User trying to access admin route, redirecting to vote');
    return NextResponse.redirect(new URL('/vote', request.url));
  }
  
  // Removed the restriction that prevented admins from accessing the vote page
  // Now admins can access both dashboard and vote pages

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}; 