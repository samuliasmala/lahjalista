import type { NextApiRequest, NextApiResponse } from 'next';
import { lucia, validateRequest } from '~/backend/auth';
import { handleError } from '~/backend/handleError';
import { HttpError } from '~/backend/HttpError';
import prisma from '~/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== 'POST') {
      throw new HttpError('Invalid request method!', 405);
    }
    const { session, user: userData } = await validateRequest(req, res);
    if (!session) {
      throw new HttpError('Unauthorized', 401);
    }

    // CHECK THIS, ei poisteta cookieta?
    /*
    await lucia.invalidateSession(session.id);
    res
      .setHeader('Set-Cookie', lucia.createBlankSessionCookie().serialize())
      .status(200)
      .end();
    */

    await prisma.user.update({
      where: {
        uuid: userData.uuid,
      },
      data: {
        isLoggedIn: false,
      },
    });
    return res.status(200).end();
  } catch (e) {
    return handleError(res, e);
  }
}
