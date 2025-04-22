import { NextRequest, NextResponse } from 'next/server';
import { COOKIE_KEYS } from '@/constants/keys';

export function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;
  const token = request.cookies.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;
  if (!token) {
    const signInUrl = new URL('/auth/sign-in', origin);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*'],
};
