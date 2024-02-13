import axios, { isAxiosError } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { Gift } from '~/pages';

const baseURL = 'http://localhost:3001/gifts';

type HandlerParams = {
  req: NextApiRequest;
  res: NextApiResponse;
  queryId: string;
};

const HANDLERS: Record<string, (params: HandlerParams) => Promise<void>> = {
  GET: handleGET,
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
      if (typeof req.query.id !== 'string') {
        throw new Error('Invalid ID', { cause: 'idError' });
      }
      const queryId = req.query.id;

      await reqHandler({ req, res, queryId });
    } else {
      return res
        .status(405)
        .send(
          `${req.method} is not a valid method. GET, PATCH, PUT and DELETE request are valid.`,
        );
    }
  } catch (e) {
    return errorFound(res, e);
  }
}

async function handleGET({ res, queryId }: HandlerParams) {
  const giftRequest = await axios.get(`${baseURL}/${queryId}`);
  return res.status(giftRequest.status).send(giftRequest.data as Gift);
}

async function handlePATCH({ req, res, queryId }: HandlerParams) {
  const patchRequest = await axios.patch(`${baseURL}/${queryId}`, req.body);
  return res.status(patchRequest.status).json(req.body);
}

async function handlePUT({ req, res, queryId }: HandlerParams) {
  const putRequest = await axios.put(`${baseURL}/${queryId}`, req.body);
  return res.status(putRequest.status).json(req.body);
}

async function handleDELETE({ req, res, queryId }: HandlerParams) {
  const deleteRequest = await axios.delete(`${baseURL}/${queryId}`);
  return res.status(deleteRequest.status).json(req.body);
}

export function errorFound(res: NextApiResponse, e: unknown) {
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
