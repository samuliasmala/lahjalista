import { NextApiRequest, NextApiResponse } from 'next';
import { authShortSession as auth } from '~/backend/auth-lahjalista';
import { handleError } from '~/backend/handleError';
import { HttpError } from '~/backend/HttpError';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== 'GET') {
      throw new HttpError('Invalid HTTP request method!', 405);
    }

    const authHeader = req.headers.authorization;

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      throw new HttpError('Unauthorized!', 401);
    }

    // if authHeader was correct we can delete expired sessions

    console.log('Cron job activated! Deleting expired sessions...');
    await auth.deleteExpiredSessions();
    res.status(200).end();
  } catch (e) {
    return handleError(res, e);
  }
}
