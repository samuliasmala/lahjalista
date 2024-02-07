import axios, { isAxiosError } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

const baseURL = 'http://localhost:3001/gifts';

function errorFound(res: NextApiResponse, e: unknown) {
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
  try {
    if (req.method !== 'GET') {
      return res
        .status(405)
        .send(
          `${req.method} is not a valid method. Only GET requests are valid!`,
        );
    }

    const giftRequest = await axios.get(`${baseURL}/${req.query.id}`);
    return res.status(giftRequest.status).send(giftRequest.data);
  } catch (e) {
    return errorFound(res, e);
  }
}
