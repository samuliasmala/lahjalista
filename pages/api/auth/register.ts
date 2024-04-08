import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { lucia } from '~/backend/auth';
import { handleError } from '~/backend/handleError';
import { HttpError } from '~/backend/HttpError';
import {
  isFirstNameValid,
  isLastNameValid,
  isPasswordValid,
} from '~/backend/utils';
import { isEmailValid } from '~/backend/utils';
import { CUSTOM_HEADER } from '~/middleware';
import type { CreateUser, User } from '~/shared/types';

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

    if (
      !isFirstNameValid(firstName) ||
      !isLastNameValid(lastName) ||
      !isEmailValid(email) ||
      !isPasswordValid(password)
    ) {
      throw new HttpError('Invalid request body!', 400);
    }

    if (CUSTOM_HEADER.key === undefined || CUSTOM_HEADER.value === undefined) {
      throw new HttpError('Server error!', 500);
    }
    const userCreationRequest = (await (
      await axios.post(
        process.env.NODE_ENV === 'production'
          ? '/api/users'
          : 'http://localhost:3000/api/users',
        {
          email: email,
          firstName: firstName,
          lastName: lastName,
          password: password,
        } as CreateUser,
        {
          headers: {
            [CUSTOM_HEADER.key]: CUSTOM_HEADER.value,
          },
        },
      )
    ).data) as User;

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
