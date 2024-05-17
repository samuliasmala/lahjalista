import { NextApiRequest, NextApiResponse } from 'next';
import { lucia } from '~/backend/auth';
import { handleError } from '~/backend/handleError';
import { HttpError } from '~/backend/HttpError';
import type { CreateUser } from '~/shared/types';
import { createUser } from '../users';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== 'POST') {
      throw new HttpError('Invalid request method!', 405);
    }
    const { email, firstName, lastName, password } = req.body as CreateUser;
    if (!email || !firstName || !lastName || !password) {
      throw new HttpError('Invalid request body!', 400);
    }

    const userData = await createUser({
      email: email,
      firstName: firstName,
      lastName: lastName,
      password: password,
    });

    const session = await lucia.createSession(userData.uuid, {
      userUUID: userData.uuid,
    });
    res
      .appendHeader(
        'Set-Cookie',
        lucia.createSessionCookie(session.id).serialize(),
      )
      .status(200)
      .end();
  } catch (e) {
    return handleError(res, e);
  }
}
