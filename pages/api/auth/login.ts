import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { luciaLongSession, lucia as luciaShortSession } from '~/backend/auth';
import { handleError } from '~/backend/handleError';
import { HttpError } from '~/backend/HttpError';
import { verifyPassword } from '~/backend/utils';
import prisma from '~/prisma';
import { Session } from '~/shared/types';
import { userLoginDetailsSchema } from '~/shared/zodSchemas';

export default async function loginHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== 'POST') {
      throw new HttpError('Invalid request method!', 405);
    }

    const userDetailsParse = userLoginDetailsSchema
      .extend({
        password: z.string().min(1),
      })
      .safeParse(req.body);

    if (!userDetailsParse.success) {
      const invalidField =
        userDetailsParse.error.issues[0].path[0] || 'Email or password';
      throw new HttpError(`${invalidField} field was invalid!`, 400);
    }
    const { email, password, rememberMe } = userDetailsParse.data;

    const lucia = rememberMe ? luciaLongSession : luciaShortSession;

    const userData = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!userData) {
      throw new HttpError('User was not found in database!', 400);
    }

    const isPasswordSame = await verifyPassword(password, userData.password);

    if (!isPasswordSame) {
      throw new HttpError('Invalid password!', 400);
    }

    const userAuthCookie = lucia.readSessionCookie(req.headers.cookie ?? '');

    let existingSession: Session | null = null;
    if (userAuthCookie) {
      existingSession = await prisma.session.findUnique({
        where: { id: userAuthCookie },
      });
    }
    const sessionId = await logUserIn(existingSession, userData.uuid);

    res
      .appendHeader(
        'Set-cookie',
        lucia.createSessionCookie(sessionId).serialize(),
      )
      .status(200)
      .end();
    return;
  } catch (e) {
    return handleError(res, e);
  }
}

async function logUserIn(existingSession: Session | null, userUUID: string) {
  // If the existing session was found update it to be logged in
  if (existingSession) {
    await prisma.session.update({
      where: { id: existingSession.id },
      data: { isLoggedIn: true },
    });
    return existingSession.id;
  }

  // Create a new session if the existing session was not found
  const newSession = await luciaShortSession.createSession(userUUID, {
    userUUID: userUUID,
    isLoggedIn: true,
  });

  return newSession.id;
}
