import { User } from '~/shared/types';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '~/prisma';
import { HttpError } from '~/backend/HttpError';
import { handleError } from '~/backend/handleError';
import { updateUserSchema } from '~/shared/zodSchemas';
import { requireLogin } from '~/backend/auth';
import { z } from 'zod';

type HandlerParams<ResponseType = unknown> = {
  req: NextApiRequest;
  res: NextApiResponse<ResponseType>;
  userData: User;
  queryUUID: string;
  isAdmin: boolean;
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
    const { user: userData } = await requireLogin(req, res);

    const reqHandler = req.method !== undefined && HANDLERS[req.method];
    if (reqHandler) {
      const queryUUIDParse = z
        .string({ message: 'Invalid UUID! It should be given as a string!' })
        .length(36, 'Invalid UUID! It should be 36 characters long!')
        .safeParse(req.query.uuid);

      if (!queryUUIDParse.success) {
        throw new HttpError(queryUUIDParse.error.format()._errors[0], 400);
      }

      const isAdmin = userData.role === 'ADMIN';

      await reqHandler({
        req,
        res,
        userData,
        queryUUID: queryUUIDParse.data,
        isAdmin,
      });
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

async function handleGET({
  res,
  userData,
  queryUUID,
  isAdmin,
}: HandlerParams<User>) {
  if (queryUUID !== userData.uuid && !isAdmin) {
    throw new HttpError("You don't have privileges to do that!", 403);
  }

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
      role: true,
    },
  });
  return res.status(200).json(user);
}

async function handlePATCH({
  req,
  res,
  userData,
  queryUUID,
  isAdmin,
}: HandlerParams<User>) {
  const updatedUserData = updateUserSchema.safeParse(req.body);

  if (!updatedUserData.success) {
    throw new HttpError('Invalid request body!', 400);
  }

  if (queryUUID !== userData.uuid && !isAdmin) {
    throw new HttpError("You don't have privileges to do that!", 403);
  }

  const updatedUser = await prisma.user.update({
    where: {
      uuid: queryUUID,
    },
    data: updatedUserData.data,
    select: {
      uuid: true,
      firstName: true,
      lastName: true,
      email: true,
      createdAt: true,
      updatedAt: true,
      role: true,
    },
  });
  return res.status(200).json(updatedUser);
}

async function handlePUT({
  req,
  res,
  userData,
  queryUUID,
  isAdmin,
}: HandlerParams<User>) {
  const updatedUserData = updateUserSchema.safeParse(req.body);

  if (!updatedUserData.success) {
    throw new HttpError('Invalid request body!', 400);
  }

  if (queryUUID !== userData.uuid && !isAdmin) {
    throw new HttpError("You don't have privileges to do that!", 403);
  }

  const updatedUser = await prisma.user.update({
    where: {
      uuid: queryUUID,
    },
    data: updatedUserData.data,
    select: {
      uuid: true,
      firstName: true,
      lastName: true,
      email: true,
      createdAt: true,
      updatedAt: true,
      role: true,
    },
  });

  return res.status(200).json(updatedUser);
}

async function handleDELETE({
  res,
  userData,
  queryUUID,
  isAdmin,
}: HandlerParams) {
  if (queryUUID !== userData.uuid && !isAdmin) {
    throw new HttpError("You don't have privileges to do that!", 403);
  }

  await prisma.user.delete({
    where: {
      uuid: queryUUID,
    },
  });

  res.status(200).end();
  return;
}
