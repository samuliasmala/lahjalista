import { NextApiRequest, NextApiResponse } from 'next';
import { handleError } from '~/backend/handleError';
import { HttpError } from '~/backend/HttpError';
import type { CreateUser } from '~/shared/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== 'POST') {
      throw new HttpError('Invalid request method!', 405);
    }
    const requestBody = req.body as CreateUser;
    if (
      !requestBody.email ||
      !requestBody.firstName ||
      !requestBody.lastName ||
      !requestBody.password
    ) {
      throw new HttpError('Invalid request body!', 400);
    }
  } catch (e) {
    return handleError(res, e);
  }
}
