import { NextApiRequest, NextApiResponse } from 'next';
import { handleError } from '~/backend/handleError';

let time: number = 0;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      if (time === 0) {
        time = new Date().getTime();
      }
      return res.status(200).send(time);
    }

    res.status(200).end();
    return;
  } catch (e) {
    return handleError(res, e);
  }
}
