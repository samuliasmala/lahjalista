import { PrismaAdapter } from '@lucia-auth/adapter-prisma';
import type { IncomingMessage, ServerResponse } from 'http';
import { Lucia, TimeSpan } from 'lucia';
import prisma from '~/prisma';
import type { PrismaUser, User } from '~/shared/types';
import type { Session } from 'lucia';

export const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(adapter, {
  sessionExpiresIn: new TimeSpan(1, 'h'),
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === 'production',
    },
  },
  getUserAttributes({
    createdAt,
    email,
    firstName,
    lastName,
    updatedAt,
    uuid,
  }: User): User {
    return {
      uuid: uuid,
      firstName: firstName,
      lastName: lastName,
      email: email,
      createdAt: createdAt,
      updatedAt: updatedAt,
    };
  },
});

export const luciaLongSession = new Lucia(adapter, {
  sessionExpiresIn: new TimeSpan(30, 'd'),
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === 'production',
    },
  },
  getUserAttributes({
    createdAt,
    email,
    firstName,
    lastName,
    updatedAt,
    uuid,
  }: User): User {
    return {
      uuid: uuid,
      firstName: firstName,
      lastName: lastName,
      email: email,
      createdAt: createdAt,
      updatedAt: updatedAt,
    };
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
): Promise<{ user: User; session: Session } | { user: null; session: null }> {
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
