import type { NextApiRequest, NextApiResponse } from 'next';
import { lucia, validateRequest } from '~/backend/auth';
import { handleError } from '~/backend/handleError';
import { HttpError } from '~/backend/HttpError';

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
    await lucia.invalidateSession(session.id);
    res
      .setHeader('Set-Cookie', lucia.createBlankSessionCookie().serialize())
      .status(200)
      .end();
  } catch (e) {
    return handleError(res, e);
  }
}
