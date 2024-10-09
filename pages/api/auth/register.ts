import { NextApiRequest, NextApiResponse } from 'next';
import { lucia } from '~/backend/auth';
import { handleError } from '~/backend/handleError';
import { HttpError } from '~/backend/HttpError';
import { createUser } from '../users';
import { createUserSchema } from '~/shared/zodSchemas';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== 'POST') {
      throw new HttpError('Invalid request method!', 405);
    }
    const validatedBody = createUserSchema.parse(req.body);

    const userData = await createUser(validatedBody);

    const session = await lucia.createSession(userData.uuid, {
      userUUID: userData.uuid,
      isLoggedIn: true,
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
