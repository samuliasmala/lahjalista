import { verifyRequestOrigin } from 'lucia';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest): Promise<NextResponse> {
  if (req.method === 'GET') {
    return NextResponse.next();
  }
  const originHeader = req.headers.get('Origin');
  const hostHeader = req.headers.get('Host');

  if (
    !originHeader ||
    !hostHeader ||
    !verifyRequestOrigin(originHeader, [hostHeader])
  ) {
    return new NextResponse(null, { status: 403 });
  }
  return NextResponse.next();
}
