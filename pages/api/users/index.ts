import { NextApiRequest, NextApiResponse } from 'next';
import { CreateUser, User } from '~/shared/types';
import prisma from '~/prisma';
import { handleError } from '~/backend/handleError';
import { hashPassword } from '~/backend/utils';
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
      role: true,
    },
  });

  return res.status(200).json(users);
}

async function handlePOST(req: NextApiRequest, res: NextApiResponse<User>) {
  const { email, firstName, lastName, password } = createUserSchema.parse(
    req.body,
  );

  const addedUser = await createUser({
    email: email.toLowerCase(),
    firstName: firstName,
    lastName: lastName,
    password: password,
  });

  return res.status(200).json(addedUser);
}

export async function createUser(userDetails: CreateUser) {
  const { email, firstName, lastName, password } =
    createUserSchema.parse(userDetails);

  const hashedPassword = await hashPassword(password);
  const addedUser = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      firstName: firstName,
      lastName: lastName,
      password: hashedPassword,
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
  return addedUser;
}
