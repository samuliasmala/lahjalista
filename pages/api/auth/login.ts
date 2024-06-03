import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { luciaLongSession, lucia as luciaShortSession } from '~/backend/auth';
import { handleError } from '~/backend/handleError';
import { HttpError } from '~/backend/HttpError';
import { verifyPassword } from '~/backend/utils';
import prisma from '~/prisma';
import { userLoginDetailsSchema } from '~/shared/zodSchemas';

export default async function handleR(
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
      throw new HttpError('User was not found in database', 400);
    }

    const isPasswordSame = await verifyPassword(password, userData.password);

    if (!isPasswordSame) {
      throw new HttpError('Invalid password!', 400);
    }

    const sessionExists = await prisma.session.findUnique({
      where: { userUUID: userData.uuid },
    });

    if (sessionExists) {
      res
        .appendHeader(
          'Set-cookie',
          lucia.createSessionCookie(sessionExists.id).serialize(),
        )
        .status(200)
        .end();
      return;
    }

    const session = await lucia.createSession(userData.uuid, {
      userUUID: userData.uuid,
    });

    res
      .appendHeader(
        'Set-cookie',
        lucia.createSessionCookie(session.id).serialize(),
      )
      .status(200)
      .end();
    return;
  } catch (e) {
    return handleError(res, e);
  }
}
