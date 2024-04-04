import { verifyRequestOrigin } from 'lucia';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const CUSTOM_HEADER = {
  key: process.env.HEADER_KEY,
  value: process.env.HEADER_VALUE,
} as const;

export async function middleware(req: NextRequest): Promise<NextResponse> {
  if (req.method === 'GET') {
    return NextResponse.next();
  }
  const originHeader = req.headers.get('Origin');
  const hostHeader = req.headers.get('Host');

  if (CUSTOM_HEADER.key !== undefined && CUSTOM_HEADER.value !== undefined) {
    if (req.headers.get(CUSTOM_HEADER.key) === CUSTOM_HEADER.value) {
      return NextResponse.next();
    }
  }

  if (
    !originHeader ||
    !hostHeader ||
    !verifyRequestOrigin(originHeader, [hostHeader])
  ) {
    return new NextResponse(null, { status: 403 });
  }
  return NextResponse.next();
}
