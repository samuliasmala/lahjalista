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
      const modelName =
        typeof e.meta?.modelName === 'string' ? e.meta?.modelName : 'Record';
      return res.status(404).send(`${modelName} was not found on the server!`);
    }
    if (e.code === 'P2002') {
      if (Array.isArray(e.meta?.target) === true) {
        const targetName =
          typeof e.meta?.target[0] === 'string' ? e.meta?.target[0] : 'Record';
        return res.status(400).send(`${targetName} was not unique!`);
      }
      return res.status(400).send('Record was not unique!');
    }
  }

  if (e instanceof PrismaClientValidationError) {
    return res.status(400).send('Invalid request body!');
  }

  console.error(e);
  return res.status(500).send('Server error!');
}
