import { verifyRequestOrigin } from 'lucia';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

//eslint-disable-next-line @typescript-eslint/require-await
export async function middleware(req: NextRequest): Promise<NextResponse> {
  // CSRF protection is only enabled in production
  if (process.env.NODE_ENV !== 'production') return NextResponse.next();

  // CSRF protection is only enabled for non-GET requests
  // See https://lucia-auth.com/guides/validate-session-cookies/
  if (req.method === 'GET' || req.method === 'HEAD') return NextResponse.next();

  // Compare the Origin and Host header for CSRF protection
  try {
    const originHeader = req.headers.get('Origin');
    const hostHeader = req.headers.get('Host');
    if (!originHeader) throw new Error('Origin header was not found!');
    if (!hostHeader) throw new Error('Host header was not found!');
    if (!verifyRequestOrigin(originHeader, [hostHeader]))
      throw new Error('Request origin verification failed!');
    return NextResponse.next();
  } catch (e) {
    console.error('Middleware error:', e instanceof Error ? e.message : '');
    return new NextResponse('Middleware error!', { status: 403 });
  }
}
