import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { pathname, searchParams, host } = req.nextUrl;
  const res = NextResponse.json({
    id: 1,
    name: 'Hong',
    pathname,
    str: searchParams.get('str'),
    ip: host,
    // cookies: req.cookies.getAll(),
  });

  res.cookies.set('x', '123');
  res.cookies.set('y', '456');

  const dbPassword = process.env.DB_PASSWD;
  const { DEV_X } = process.env;

  console.log(dbPassword, DEV_X);

  return res;
}
