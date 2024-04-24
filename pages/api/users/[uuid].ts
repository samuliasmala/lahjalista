import { User } from '~/shared/types';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '~/prisma';
import { HttpError } from '~/backend/HttpError';
import { handleError } from '~/backend/handleError';
import { userSchema } from '~/shared/zodSchemas';

type HandlerParams<ResponseType = unknown> = {
  req: NextApiRequest;
  res: NextApiResponse<ResponseType>;
  queryUUID: string;
};

const HANDLERS: Record<string, (params: HandlerParams) => Promise<void>> = {
  GET: handleGET,
  PATCH: handlePATCH,
  PUT: handlePUT,
  DELETE: handleDELETE,
};

export default async function handlePrisma(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const reqHandler = req.method !== undefined && HANDLERS[req.method];
    if (reqHandler) {
      if (typeof req.query.uuid !== 'string') {
        throw new HttpError('Invalid ID', 400);
      }
      const queryUUID = req.query.uuid;
      await reqHandler({ req, res, queryUUID });
    } else {
      throw new HttpError(
        `${req.method} is not a valid method. GET, PATCH, PUT and DELETE request are valid.`,
        405,
      );
    }
  } catch (e) {
    return handleError(res, e);
  }
}

async function handleGET({ res, queryUUID }: HandlerParams<User>) {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      uuid: queryUUID,
    },
    select: {
      uuid: true,
      firstName: true,
      lastName: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return res.status(200).json(user);
}

async function handlePATCH({ req, res, queryUUID }: HandlerParams<User>) {
  const newUserDetails = userSchema
    .pick({ email: true, firstName: true, lastName: true })
    .parse(req.body);

  const updatedUser = await prisma.user.update({
    where: {
      uuid: queryUUID,
    },
    data: {
      email: newUserDetails.email?.toLowerCase(),
      firstName: newUserDetails.firstName,
      lastName: newUserDetails.lastName,
    },
    select: {
      uuid: true,
      firstName: true,
      lastName: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return res.status(200).json(updatedUser);
}

async function handlePUT({ req, res, queryUUID }: HandlerParams<User>) {
  const newUserDetails = userSchema
    .pick({ email: true, firstName: true, lastName: true })
    .parse(req.body);

  const updatedUser = await prisma.user.update({
    where: {
      uuid: queryUUID,
    },
    data: {
      email: newUserDetails.email.toLowerCase(),
      firstName: newUserDetails.firstName,
      lastName: newUserDetails.lastName,
    },
    select: {
      uuid: true,
      firstName: true,
      lastName: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return res.status(200).json(updatedUser);
}

async function handleDELETE({ res, queryUUID }: HandlerParams) {
  await prisma.user.delete({
    where: {
      uuid: queryUUID,
    },
  });

  res.status(200).end();
  return;
}
