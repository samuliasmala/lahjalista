import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { luciaLongSession, lucia as luciaShortSession } from '~/backend/auth';
import { authLongSession, authShortSession } from '~/backend/auth-lahjalista';
import { handleError } from '~/backend/handleError';
import { HttpError } from '~/backend/HttpError';
import { verifyPassword } from '~/backend/utils';
import prisma from '~/prisma';
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

    const auth = rememberMe ? authLongSession : authShortSession;

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

    const sessionId = await logUserIn(userData.uuid, rememberMe);

    res
      .appendHeader(
        'Set-cookie',
        auth.createSessionCookie(sessionId).serialize(),
      )
      .status(200)
      .end();
    return;
  } catch (e) {
    return handleError(res, e);
  }
}

async function logUserIn(userUUID: string, rememberMe: boolean) {
  const lucia = rememberMe ? luciaLongSession : luciaShortSession;

  const newSession = await lucia.createSession(userUUID, {
    userUUID: userUUID,
    isLoggedIn: true,
  });

  return newSession.id;
}
