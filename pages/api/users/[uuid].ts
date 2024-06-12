import { User } from '~/shared/types';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '~/prisma';
import { HttpError } from '~/backend/HttpError';
import { handleError } from '~/backend/handleError';
import { updateUserSchema } from '~/shared/zodSchemas';

type HandlerParams<ResponseType = unknown> = {
  req: NextApiRequest;
  res: NextApiResponse<ResponseType>;
  userUUID: string;
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
      const userUUID = req.query.uuid;
      await reqHandler({ req, res, userUUID });
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

async function handleGET({ res, userUUID }: HandlerParams<User>) {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      uuid: userUUID,
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

async function handlePATCH({ req, res, userUUID }: HandlerParams<User>) {
  const userData = updateUserSchema.safeParse(req.body);

  if (!userData.success) {
    throw new HttpError('Invalid request body!', 400);
  }

  const updatedUser = await prisma.user.update({
    where: {
      uuid: userUUID,
    },
    data: userData.data,
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

async function handlePUT({ req, res, userUUID }: HandlerParams<User>) {
  const userData = updateUserSchema.safeParse(req.body);

  if (!userData.success) {
    throw new HttpError('Invalid request body!', 400);
  }

  const updatedUser = await prisma.user.update({
    where: {
      uuid: userUUID,
    },
    data: userData.data,
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

async function handleDELETE({ res, userUUID }: HandlerParams) {
  await prisma.user.delete({
    where: {
      uuid: userUUID,
    },
  });

  res.status(200).end();
  return;
}
