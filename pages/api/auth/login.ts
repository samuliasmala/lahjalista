import type { NextApiRequest, NextApiResponse } from 'next';
import { adapter, lucia as luciaShortSession } from '~/backend/auth';
import { handleError } from '~/backend/handleError';
import { HttpError } from '~/backend/HttpError';
import { verifyPassword } from '~/backend/utils';
import prisma from '~/prisma';
import { Lucia, TimeSpan } from 'lucia';
import { userLoginDetailsSchema } from '~/shared/zodSchemas';

const luciaLongSession = new Lucia(adapter, {
  sessionExpiresIn: new TimeSpan(30, 'd'),
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === 'production',
    },
  },
});

export default async function handleR(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== 'POST') {
      throw new HttpError('Invalid request method!', 405);
    }

    const { email, password, rememberMe } = userLoginDetailsSchema.parse(
      req.body,
    );

    const lucia = rememberMe ? luciaLongSession : luciaShortSession;

    const userData = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!userData) {
      throw new HttpError('Invalid credentials!', 400);
    }

    const isPasswordSame = await verifyPassword(password, userData.password);

    if (!isPasswordSame) {
      throw new HttpError('Invalid credentials!', 400);
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
      user: {
        connect: {
          uuid: userData.uuid,
        },
      },
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
