import { NextApiRequest, NextApiResponse } from 'next';
import { CreateUser, User } from '~/shared/types';
import prisma from '~/prisma';
import { hash } from 'bcrypt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { handleError } from '~/backend/handleError';
import { emailRegex } from '~/shared/regexPatterns';
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
  isEmailValid(userDetails.email);

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

  return res.status(200).json(addedUser);
}

function isEmailValid(emailAddress: string): boolean {
  const checkedEmailAddress = emailAddress.toLowerCase().match(emailRegex);

  if (checkedEmailAddress === null) {
    throw new HttpError('Invalid email!', 400);
  }

  // email is ready to be used
  return true;
}

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  const hashedPassword = await hash(password, saltRounds);
  return hashedPassword;
}
