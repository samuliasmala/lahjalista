import { User } from '~/shared/types';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '~/prisma';
import { HttpError } from '~/backend/HttpError';
import { handleError } from '~/backend/handleError';
import { updateUserSchema } from '~/shared/zodSchemas';
import { validateRequest } from '~/backend/auth';
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
    const validationRequest = await validateRequest(req, res);
    if (!validationRequest.session || !validationRequest.user) {
      throw new HttpError('You are unauthorized!', 401);
    }
    const reqHandler = req.method !== undefined && HANDLERS[req.method];
    if (reqHandler) {
      const queryUUID = z.string().safeParse(req.query.uuid);
      if (!queryUUID.success) {
        throw new HttpError(
          'Invalid UUID! It should be given as a string!',
          400,
        );
      }
      const isAdmin = validationRequest.user.role === 'ADMIN';
      await reqHandler({
        req,
        res,
        userData: validationRequest.user,
        queryUUID: queryUUID.data,
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
  const isAdminSearchingSpecificUser = queryUUID !== userData.uuid && isAdmin;

  const databaseSearchUUID = isAdminSearchingSpecificUser
    ? queryUUID
    : userData.uuid;

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      uuid: databaseSearchUUID,
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
  const isAdminEditingSpecificUser = queryUUID !== userData.uuid && isAdmin;

  const databaseSearchUUID = isAdminEditingSpecificUser
    ? queryUUID
    : userData.uuid;

  const updatedUser = await prisma.user.update({
    where: {
      uuid: databaseSearchUUID,
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
  const isAdminEditingSpecificUser = queryUUID !== userData.uuid && isAdmin;

  const databaseSearchUUID = isAdminEditingSpecificUser
    ? queryUUID
    : userData.uuid;

  const updatedUser = await prisma.user.update({
    where: {
      uuid: databaseSearchUUID,
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
  const isAdminDeletingSpecificUser = queryUUID !== userData.uuid && isAdmin;

  const databaseSearchUUID = isAdminDeletingSpecificUser
    ? queryUUID
    : userData.uuid;

  await prisma.user.delete({
    where: {
      uuid: databaseSearchUUID,
    },
  });

  res.status(200).end();
  return;
}
