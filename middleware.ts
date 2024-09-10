import { verifyRequestOrigin } from 'lucia';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

//eslint-disable-next-line @typescript-eslint/require-await
export async function middleware(req: NextRequest): Promise<NextResponse> {
  if (process.env.NODE_ENV == 'production') {
    const originHeader = req.headers.get('Origin');
    const hostHeader = req.headers.get('Host');
    if (
      !originHeader ||
      !hostHeader ||
      !verifyRequestOrigin(originHeader, [hostHeader])
    ) {
      const headerErrors = [];
      !originHeader ? headerErrors.push('Origin header') : '';
      !hostHeader ? headerErrors.push('Host header') : '';
      !verifyRequestOrigin(originHeader || '', [hostHeader || ''])
        ? headerErrors.push('Request origin header')
        : '';
      return new NextResponse(
        `Middleware error!\n\nError: ${headerErrors[0]} was invalid!`,
        { status: 403 },
      );
    }
  }
  return NextResponse.next();
}
