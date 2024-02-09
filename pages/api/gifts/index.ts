import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { Gift } from '../..';
import { errorFound } from './[id]';

const baseURL = 'http://localhost:3001/gifts';

const HANDLERS: Record<
  string,
  (req: NextApiRequest, res: NextApiResponse) => Promise<void>
> = {
  GET: handleGET,
  POST: handlePOST,
} as const;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const reqHandler = req.method !== undefined && HANDLERS[req.method];
    if (reqHandler) {
      await reqHandler(req, res);
    } else {
      return res
        .status(405)
        .send(
          `${req.method} is not a valid method. Valid methods are: GET and POST`,
        );
    }
  } catch (e) {
    return errorFound(res, e);
  }
}

async function handleGET(req: NextApiRequest, res: NextApiResponse) {
  const giftRequest = await axios.get(`${baseURL}`);
  return res.status(giftRequest.status).json(giftRequest.data as Gift[]);
}

async function handlePOST(req: NextApiRequest, res: NextApiResponse) {
  const postRequest = await axios.post(baseURL, req.body);
  return res.status(postRequest.status).json(req.body);
}
