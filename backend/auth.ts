import { PrismaAdapter } from '@lucia-auth/adapter-prisma';
import type { IncomingMessage, ServerResponse } from 'http';
import { Lucia, TimeSpan } from 'lucia';
import prisma from '~/prisma';
import type { PrismaUser, User } from '~/shared/types';
import type { Session, User as LuciaUser } from 'lucia';

export const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(adapter, {
  sessionExpiresIn: new TimeSpan(1, 'h'),
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === 'production',
    },
  },
  getUserAttributes(user): User {
    const { uuid, firstName, lastName, email, createdAt, updatedAt } = user;
    return { uuid, firstName, lastName, email, createdAt, updatedAt };
  },
});

export const luciaLongSession = new Lucia(adapter, {
  sessionExpiresIn: new TimeSpan(30, 'd'),
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === 'production',
    },
  },
  getUserAttributes(user): User {
    const { uuid, firstName, lastName, email, createdAt, updatedAt } = user;
    return { uuid, firstName, lastName, email, createdAt, updatedAt };
  },
});

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: PrismaUser;
  }
}

export async function validateRequest(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<
  { user: LuciaUser; session: Session } | { user: null; session: null }
> {
  const sessionId = lucia.readSessionCookie(req.headers.cookie ?? '');
  if (!sessionId) {
    return {
      user: null,
      session: null,
    };
  }
  const result = await lucia.validateSession(sessionId);
  if (result.session && result.session.fresh) {
    res.appendHeader(
      'Set-Cookie',
      lucia.createSessionCookie(result.session.id).serialize(),
    );
  }
  if (!result.session) {
    res.appendHeader(
      'Set-Cookie',
      lucia.createBlankSessionCookie().serialize(),
    );
  }

  return result;
}
