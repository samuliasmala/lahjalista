import { User } from '~/shared/types';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '~/prisma';
import { errorFound } from '.';

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
        throw new Error('Invalid ID', { cause: 'idError' });
      }
      const queryUUID = req.query.uuid;
      await reqHandler({ req, res, queryUUID });
    } else {
      return res
        .status(405)
        .send(
          `${req.method} is not a valid method. GET, PATCH, PUT and DELETE request are valid.`,
        );
    }
  } catch (e) {
    return errorFound(res, e);
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
  const newUserDetails = req.body as Partial<User>;

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
  const newUserDetails = req.body as User;

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
