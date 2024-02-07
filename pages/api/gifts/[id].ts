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
    console.log(req.query, '[id].ts');

    const giftRequest = await axios.get(`${baseURL}/${req.query.id}`);
    console.log(giftRequest);

    return res.status(200).send(req.query.id);
  } catch (e) {
    console.log('Error');
  }
}
