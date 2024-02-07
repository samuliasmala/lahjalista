import axios, { isAxiosError } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { Gift } from '..';

const baseURL = 'http://localhost:3001/gifts';

function catchError(res: NextApiResponse, e: unknown) {
  if (isAxiosError(e) && e.response?.status === 404) {
    return res
      .status(e.response.status)
      .send('Lahjaa ei löytynyt palvelimelta!');
  } else if (isAxiosError(e) && e.code === 'ECONNREFUSED') {
    return res.status(500).send('Palvelin virhe!');
  } else if (e instanceof Error) {
    return res.status(500).send('Odottamaton virhe tapahtui!');
  } else {
    return res.status(500).send('Odottamaton virhe tapahtui!');
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
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
  const reqHandler = req.method !== undefined && HANDLERS[req.method];
  if (reqHandler) {
    await reqHandler(req, res);
  } else {
    return res
      .status(400)
      .send(
        `${req.method} is not a valid method. Valid methods are: GET, POST, PATCH, PUT and DELETE!`,
      );
  }
}

async function handleGET(req: NextApiRequest, res: NextApiResponse) {
  // if req.query.id is not undefined, only one gift is wanted to be returned
  try {
    if (req.query.id !== undefined) {
      const queryId = req.query.id as string;
      const giftRequest = await axios.get(`${baseURL}/${queryId}`);
      return res.status(giftRequest.status).json(giftRequest.data as Gift);
    }
    // else return all the gifts as an array
    const gifts = await axios.get(baseURL);
    return res.status(gifts.status).json(gifts.data as Gift[]);
  } catch (e) {
    return catchError(res, e);
  }
}

async function handlePOST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const postRequest = await axios.post(baseURL, req.body);
    return res.status(postRequest.status).json(req.body);
  } catch (e) {
    return catchError(res, e);
  }
}

async function handlePATCH(req: NextApiRequest, res: NextApiResponse) {
  try {
    const queryId = req.query.id as string;
    const patchRequest = await axios.patch(`${baseURL}/${queryId}`, req.body);
    return res.status(patchRequest.status).json(req.body);
  } catch (e) {
    return catchError(res, e);
  }
}

async function handlePUT(req: NextApiRequest, res: NextApiResponse) {
  try {
    const queryId = req.query.id as string;
    const putRequest = await axios.put(`${baseURL}/${queryId}`, req.body);
    return res.status(putRequest.status).json(req.body);
  } catch (e) {
    return catchError(res, e);
  }
}

async function handleDELETE(req: NextApiRequest, res: NextApiResponse) {
  try {
    const queryId = req.query.id as string; // forcing string type for queryId does not seem the best way to pass ESLint error, would probably be better to get it from req.body
    const deleteRequest = await axios.delete(`${baseURL}/${queryId}`);
    return res.status(deleteRequest.status).json(req.body);
  } catch (e) {
    return catchError(res, e);
  }
}
