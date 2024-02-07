import axios, { isAxiosError } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { Gift } from '~/pages';

const baseURL = 'http://localhost:3001/gifts';

const HANDLERS: Record<
  string,
  (req: NextApiRequest, res: NextApiResponse) => Promise<void>
> = {
  GET: handleGET,
  POST: handlePOST,
  PATCH: handlePATCH,
  PUT: handlePUT,
  DELETE: handleDELETE,
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
          `${req.method} is not a valid method. Only GET requests are valid!`,
        );
    }
  } catch (e) {
    return errorFound(res, e);
  }
}

async function handleGET(req: NextApiRequest, res: NextApiResponse) {
  if (typeof req.query.id === 'string') {
    const giftRequest = await axios.get(`${baseURL}/${req.query.id}`);
    return res.status(giftRequest.status).send(giftRequest.data as Gift[]);
  }
  throw new Error('Invalid ID', { cause: 'idError' });
}

async function handlePOST(req: NextApiRequest, res: NextApiResponse) {
  const postRequest = await axios.post(baseURL, req.body);
  return res.status(postRequest.status).json(req.body);
}

async function handlePATCH(req: NextApiRequest, res: NextApiResponse) {
  if (typeof req.query.id === 'string') {
    const patchRequest = await axios.patch(
      `${baseURL}/${req.query.id as string}`,
      req.body,
    );
    return res.status(patchRequest.status).json(req.body);
  }
  throw new Error('Invalid ID', { cause: 'idError' });
}

async function handlePUT(req: NextApiRequest, res: NextApiResponse) {
  const putRequest = await axios.put(`${baseURL}/${req.query.id}`, req.body);
  return res.status(putRequest.status).json(req.body);
}

async function handleDELETE(req: NextApiRequest, res: NextApiResponse) {
  if (typeof req.query.id === 'string') {
    const deleteRequest = await axios.delete(`${baseURL}/${req.query.id}`);
    return res.status(deleteRequest.status).json(req.body);
  }
  throw new Error('Invalid ID', { cause: 'idError' });
}

function errorFound(res: NextApiResponse, e: unknown) {
  if (isAxiosError(e) && e.response?.status === 404) {
    return res
      .status(e.response.status)
      .send('Lahjaa ei löytynyt palvelimelta!');
  } else if (isAxiosError(e) && e.code === 'ECONNREFUSED') {
    return res.status(500).send('Palvelin virhe!');
  } else if (e instanceof Error) {
    if (e.cause === 'idError') return res.status(400).send('Virheellinen ID!');
    return res.status(500).send('Odottamaton virhe tapahtui!');
  } else {
    return res.status(500).send('Odottamaton virhe tapahtui!');
  }
}
