import { PrismaAdapter } from '@lucia-auth/adapter-prisma';
import type { IncomingMessage, ServerResponse } from 'http';
import { Lucia, TimeSpan } from 'lucia';
import prisma from '~/prisma';
import type { PrismaUser, User } from '~/shared/types';
import type { Session, User as LuciaUser } from 'lucia';
import { NextApiRequest, NextApiResponse } from 'next';
import { HttpError } from './HttpError';

export const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(adapter, {
  sessionExpiresIn: new TimeSpan(1, 'h'),
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === 'production',
    },
  },
  getUserAttributes(user): User {
    const { uuid, firstName, lastName, email, createdAt, updatedAt, role } =
      user;
    return { uuid, firstName, lastName, email, createdAt, updatedAt, role };
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
    const { uuid, firstName, lastName, email, createdAt, updatedAt, role } =
      user;
    return { uuid, firstName, lastName, email, createdAt, updatedAt, role };
  },
});

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: PrismaUser;
    DatabaseSessionAttributes: { userUUID: string };
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

export async function requireLogin(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<{ user: LuciaUser; session: Session }> {
  const userDetails = await validateRequest(req, res);
  if (!userDetails.session || !userDetails.user) {
    throw new HttpError('You are unauthorized!', 401);
  }
  return userDetails;
}
