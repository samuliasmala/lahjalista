import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res
      .status(405)
      .send(
        `${req.method} is not a valid method. Only GET requests are valid!`,
      );
  }
  console.log(req.query, '[id].ts');

  return res.status(200).send(req.query.id);
}
