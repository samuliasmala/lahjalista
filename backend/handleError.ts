import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { NextApiResponse } from 'next';
import { HttpError } from './HttpError';

export function handleError(res: NextApiResponse, e: unknown) {
  if (e instanceof HttpError) {
    return res.status(e.httpStatusCode ?? 400).send(e.message);
  }

  if (e instanceof PrismaClientKnownRequestError) {
    if (e.code === 'P2025') {
      return res.status(404).send('Gift was not found on the server!');
    }
  }

  if (e instanceof PrismaClientValidationError) {
    return res.status(400).send('Invalid request body!');
  }

  console.error(e);
  return res.status(500).send('Server error!');
}
