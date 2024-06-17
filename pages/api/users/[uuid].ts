import { User } from '~/shared/types';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '~/prisma';
import { HttpError } from '~/backend/HttpError';
import { handleError } from '~/backend/handleError';
import { updateUserSchema } from '~/shared/zodSchemas';
import { validateRequest } from '~/backend/auth';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { z } from 'zod';

type HandlerParams<ResponseType = unknown> = {
  req: NextApiRequest;
  res: NextApiResponse<ResponseType>;
  userData: User;
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
      await reqHandler({ req, res, userData: validationRequest.user });
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

async function handleGET({ req, res, userData }: HandlerParams<User>) {
  const queryUUID = z.string().safeParse(req.query.uuid);
  if (!queryUUID.success) {
    throw new HttpError('Invalid UUID! It should be given as a string!', 400);
  }
  const isAdminSearchingSpecificUser =
    queryUUID.data !== userData.uuid && userData.role === 'ADMIN';

  // uuid value inside databaseSearchParameter variable is just to be a placeholder value
  // that removes following error: Type '{}' is not assignable to type 'UserWhereUniqueInput'.
  const databaseSearchParameter: Prisma.UserWhereUniqueInput = { uuid: '' };
  if (isAdminSearchingSpecificUser) {
    databaseSearchParameter.uuid = queryUUID.data;
  } else {
    databaseSearchParameter.uuid = userData.uuid;
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: databaseSearchParameter,
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

async function handlePATCH({ req, res, userData }: HandlerParams<User>) {
  const updatedUserData = updateUserSchema.safeParse(req.body);

  if (!updatedUserData.success) {
    throw new HttpError('Invalid request body!', 400);
  }

  const updatedUser = await prisma.user.update({
    where: {
      uuid: userData.uuid,
    },
    data: updatedUserData,
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

async function handlePUT({ req, res, userData }: HandlerParams<User>) {
  const updatedUserData = updateUserSchema.safeParse(req.body);

  if (!updatedUserData.success) {
    throw new HttpError('Invalid request body!', 400);
  }

  const updatedUser = await prisma.user.update({
    where: {
      uuid: userData.uuid,
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

async function handleDELETE({ res, userData }: HandlerParams) {
  await prisma.user.delete({
    where: {
      uuid: userData.uuid,
    },
  });

  res.status(200).end();
  return;
}
