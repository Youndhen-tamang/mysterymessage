import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request }); // Get the token from the request
  const url = request.nextUrl;

  // Redirect authenticated users away from sign-in or sign-up
  if (token) {
    if (url.pathname.startsWith('/sign-in') || url.pathname.startsWith('/sign-up')) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    // Allow access to other routes
    return NextResponse.next();
  }

  // Redirect unauthenticated users to /sign-in for protected routes
  if (
    url.pathname.startsWith('/dashboard') ||
    url.pathname.startsWith('/verify')
  ) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // Allow unauthenticated users access to public routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/sign-in',
    '/sign-up',
    '/',
    '/dashboard/:path*',
    '/verify/:path*',
  ],
};
