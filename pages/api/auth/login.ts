import type { NextApiRequest, NextApiResponse } from 'next';
import { lucia } from '~/backend/auth';
import { handleError } from '~/backend/handleError';
import { HttpError } from '~/backend/HttpError';
import { UserLoginDetails } from '~/shared/types';
import { isEmailValid, isPasswordValid, verifyPassword } from '~/backend/utils';
import prisma from '~/prisma';

export default async function handleR(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== 'POST') {
      throw new HttpError('Invalid request method!', 405);
    }

    const { email, password } = req.body as UserLoginDetails;

    if (
      !email ||
      !password ||
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      email.length <= 0 ||
      password.length <= 0
    ) {
      throw new HttpError('Invalid request body!', 400);
    }

    if (!isEmailValid(email) || !isPasswordValid(password)) {
      throw new HttpError('Invalid request body!', 400);
    }

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
