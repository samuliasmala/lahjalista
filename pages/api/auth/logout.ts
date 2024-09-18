import type { NextApiRequest, NextApiResponse } from 'next';
import { validateRequest } from '~/backend/auth';
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
    const { session } = await validateRequest(req, res);
    if (!session) {
      throw new HttpError('Unauthorized', 401);
    }

    await prisma.session.update({
      where: { id: session.id },
      data: {
        isLoggedIn: false,
      },
    });

    res.status(200).end();
    return;
  } catch (e) {
    return handleError(res, e);
  }
}
