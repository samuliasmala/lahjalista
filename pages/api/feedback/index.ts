import type { NextApiRequest, NextApiResponse } from 'next';
import { validateRequest } from '~/backend/auth';
import { HttpError } from '~/backend/HttpError';
import { createFeedbackSchema } from '~/shared/zodSchemas';
import { handleGeneralError } from '~/utils/handleError';

const HANDLER: Record<
  string,
  (req: NextApiRequest, res: NextApiResponse) => Promise<void>
> = {
  GET: handleGET,
  POST: handlePOST,
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== 'POST') {
      throw new HttpError('Invalid request method!', 405);
    }
    // alla oleva ei toimi, koska palaute pyydetään sillon kun käyttäjä on kirjautunut ulos, annetaan koodin kuitenkin olla vielä siinä
    /*
  const { session } = await validateRequest(req, res);
  if (!session) {
    throw new HttpError('Unauthorized', 401);
  }
  */
    const reqHandler = req.method !== undefined && HANDLER[req.method];
    if (reqHandler) {
      await reqHandler(req, res);
    } else {
      throw new HttpError(
        `${req.method} is not a valid method. Only GET and POST requests are valid!`,
        405,
      );
    }
  } catch (e) {
    handleGeneralError(e);
  }
}

async function handleGET(req: NextApiRequest, res: NextApiResponse) {}

async function handlePOST(req: NextApiRequest, res: NextApiResponse) {
  const parse = createFeedbackSchema.parse(req.body);
  console.log(parse);

  return res.status(200).end();
}
