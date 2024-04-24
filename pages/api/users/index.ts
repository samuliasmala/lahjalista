import { NextApiRequest, NextApiResponse } from 'next';
import { CreateUser, User } from '~/shared/types';
import prisma from '~/prisma';
import { handleError } from '~/backend/handleError';
import { hashPassword } from '~/backend/utils';
import {
  isEmailValid,
  isFirstNameValid,
  isLastNameValid,
  isPasswordValid,
} from '~/backend/isValidFunctionsBackend';
import { HttpError } from '~/backend/HttpError';
import { createUserSchema } from '~/shared/zodSchemas';

const HANDLER: Record<
  string,
  (req: NextApiRequest, res: NextApiResponse) => Promise<void>
> = {
  GET: handleGET,
  POST: handlePOST,
};

export default async function handlePrisma(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const reqHandler = req.method !== undefined && HANDLER[req.method];
    if (reqHandler) {
      await reqHandler(req, res);
    } else {
      throw new HttpError(
        `${req.method} is not a valid method. Only GET and POST requests are valid!`,
        405,
      );
    }
  } catch (e) {
    return handleError(res, e);
  }
}

async function handleGET(req: NextApiRequest, res: NextApiResponse<User[]>) {
  const users = await prisma.user.findMany({
    select: {
      uuid: true,
      firstName: true,
      lastName: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return res.status(200).json(users);
}

async function handlePOST(req: NextApiRequest, res: NextApiResponse<User>) {
  const userDetails = createUserSchema.parse(req.body);

  const addedUser = await createUser({
    email: userDetails.email.toLowerCase(),
    firstName: userDetails.firstName,
    lastName: userDetails.lastName,
    password: userDetails.password,
  });

  return res.status(200).json(addedUser);
}

export async function createUser(userDetails: CreateUser) {
  const verifiedUserDetails = createUserSchema.parse(userDetails);

  const password = await hashPassword(verifiedUserDetails.password);
  const addedUser = await prisma.user.create({
    data: {
      email: verifiedUserDetails.email.toLowerCase(),
      firstName: verifiedUserDetails.firstName,
      lastName: verifiedUserDetails.lastName,
      password: password,
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
  return addedUser;
}
