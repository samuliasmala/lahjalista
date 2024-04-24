import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { NextApiResponse } from 'next';
import { HttpError } from './HttpError';
import { ZodError } from 'zod';

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
      const targetName =
        Array.isArray(e.meta?.target) && typeof e.meta.target[0] === 'string'
          ? e.meta.target[0]
          : 'Record';
      return res.status(400).send(`${targetName} was not unique!`);
    }
  }

  if (e instanceof PrismaClientValidationError) {
    return res.status(400).send('Invalid request body!');
  }

  if (e instanceof ZodError) {
    const issueMessage = e.issues[0].message;
    if (issueMessage === 'Required') {
      const fieldRequired = e.issues[0].path[0] ?? 'Required';
      return res.status(400).send(`${fieldRequired} field was missing!`);
    }
    if (issueMessage === 'Invalid') {
      const invalidFieldText =
        `${e.issues[0].path[0]} field was invalid!` ??
        'One of the given fields was invalid!';
      return res.status(400).send(invalidFieldText);
    }
    return res.status(400).send('Sent request is invalid!');
  }

  console.error(e);
  return res.status(500).send('Server error!');
}
