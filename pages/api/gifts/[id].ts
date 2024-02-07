import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(req.query, '[id].ts');
  return res.status(200).send(req.query.id);
}
