import { PrismaAdapter } from '@lucia-auth/adapter-prisma';
import type { IncomingMessage, ServerResponse } from 'http';
import { Lucia, TimeSpan } from 'lucia';
import prisma from '~/prisma';
import type { PrismaUser, User } from '~/shared/types';
import type { Session as LuciaSession, User as LuciaUser } from 'lucia';
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
  getSessionAttributes(session) {
    const { isLoggedIn } = session;
    return { isLoggedIn };
  },
  getUserAttributes(user): User {
    const { uuid, firstName, lastName, email, createdAt, updatedAt, role } =
      user;
    return {
      uuid,
      firstName,
      lastName,
      email,
      createdAt,
      updatedAt,
      role,
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
  getSessionAttributes(session) {
    const { isLoggedIn } = session;
    return { isLoggedIn };
  },
  getUserAttributes(user): User {
    const { uuid, firstName, lastName, email, createdAt, updatedAt, role } =
      user;
    return {
      uuid,
      firstName,
      lastName,
      email,
      createdAt,
      updatedAt,
      role,
    };
  },
});

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: PrismaUser;
    DatabaseSessionAttributes: { userUUID: string; isLoggedIn: boolean };
  }
}

export async function validateRequest(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<
  { user: LuciaUser; session: LuciaSession } | { user: null; session: null }
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
): Promise<{ user: LuciaUser; session: LuciaSession }> {
  const userDetails = await validateRequest(req, res);
  if (
    !userDetails.session ||
    !userDetails.user ||
    !userDetails.session.isLoggedIn
  ) {
    throw new HttpError('You are unauthorized!', 401);
  }
  return userDetails;
}

/**
 * Checks for a valid user and session, **REGARDLESS** of login status
 *
 * **ATTENTION**: the user **DOES NOT** need to be logged in for this function to validate request
 */

export async function checkIfSessionValid(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<{ user: User; session: LuciaSession }> {
  const userData = await validateRequest(req, res);
  if (!userData.session || !userData.user) {
    throw new HttpError('You are unauthorized!', 401);
  }
  return userData;
}
