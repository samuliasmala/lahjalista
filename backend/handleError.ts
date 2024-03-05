import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { NextApiResponse } from 'next';

export function handleError(res: NextApiResponse, e: unknown) {
  if (e instanceof PrismaClientKnownRequestError) {
    if (e.code === 'P2025') {
      return res.status(404).send('Gift was not found on the server!');
    }
  }

  return res.status(500).send('Server error!');
}
