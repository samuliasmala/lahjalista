import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

const baseURL = 'http://localhost:3001/gifts';

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
    console.log('Error');
    return res.status(404).send('Was not found');
  }
}
