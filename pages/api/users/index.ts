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
} from '~/shared/isValidFunctions';
import { HttpError } from '~/backend/HttpError';

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
  const userDetails = req.body as CreateUser;

  const addedUser = await createUser({
    email: userDetails.email.toLowerCase(),
    firstName: userDetails.firstName,
    lastName: userDetails.lastName,
    password: userDetails.password,
  });

  return res.status(200).json(addedUser);
}

export async function createUser(userDetails: CreateUser) {
  if (
    !isEmailValid(userDetails.email) ||
    !isFirstNameValid(userDetails.firstName) ||
    !isLastNameValid(userDetails.lastName) ||
    !isPasswordValid(userDetails.password)
  ) {
    throw new HttpError('Invalid credentials', 400);
  }
  const password = await hashPassword(userDetails.password);
  const addedUser = await prisma.user.create({
    data: {
      email: userDetails.email.toLowerCase(),
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
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
