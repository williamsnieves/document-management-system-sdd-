import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Use cookie to track completion for the UI demo since memory store isn't shared with edge
  const isOnboardingComplete = request.cookies.get('onboarding_complete')?.value === 'true';
  const isOnboardingRoute = pathname.startsWith('/onboarding');
  const isAppRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/library') || pathname.startsWith('/settings');

  // Allow settings roles onboarding config for admin to bypass guard
  if (pathname.startsWith('/settings/roles/onboarding')) {
    return NextResponse.next();
  }

  // Bypass if previewing flow
  if (request.nextUrl.searchParams.get('preview') === 'true') {
    return NextResponse.next();
  }

  if (isAppRoute && !isOnboardingComplete) {
    return NextResponse.redirect(new URL('/onboarding', request.url));
  }

  if (isOnboardingRoute && isOnboardingComplete) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/library/:path*', '/settings/:path*', '/onboarding/:path*'],
};
