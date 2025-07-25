import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/hello')) {
    const path = pathname.substring(pathname.lastIndexOf('/'));

    return NextResponse.redirect(new URL(`/hi${path}?q=000`, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/hello/:path', '/api/folders', '/api/:path*'],
};