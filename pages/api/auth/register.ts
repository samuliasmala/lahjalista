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
    const { email, firstName, lastName, password } = createUserSchema
      .pick({ email: true, firstName: true, lastName: true, password: true })
      .parse(req.body);

    const userCreationRequest = await createUser({
      email: email,
      firstName: firstName,
      lastName: lastName,
      password: password,
    });

    const session = await lucia.createSession(userCreationRequest.uuid, {
      user: {
        connect: {
          uuid: userCreationRequest.uuid,
        },
      },
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
