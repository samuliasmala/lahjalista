import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { NextApiResponse } from 'next';
import { HttpError } from './HttpError';
import { ZodError, ZodIssue } from 'zod';

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
    return zodErrorHandler(res, e.issues[0]);
  }

  console.error(e);
  return res.status(500).send('Server error!');
}

function zodErrorHandler(res: NextApiResponse, e: ZodIssue) {
  switch (e.code) {
    case 'invalid_type':
      // code below is run if some of the fields is missing
      if (e.received === 'undefined') {
        return res.status(400).send(`${e.path[0]} was missing!`);
      }
      if (e.received !== e.expected) {
        return res
          .status(400)
          .send(
            `${e.path[0]}'s type was invalid, got ${e.received}, should be ${e.expected}`,
          );
      }
      break;

    case 'invalid_string':
      if (e.validation === 'regex') {
        return res.status(400).send(`${e.path[0]} has an invalid format!`);
      }
      break;

    case 'too_small':
      return res
        .status(400)
        .send(`${e.path[0]} is required and cannot be empty!`);

    case 'too_big':
      return res.status(400).send(`${e.path[0]} was too long!`);

    default:
      return res.status(400).send('Sent request was invalid!');
  }
}
