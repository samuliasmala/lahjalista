import { NextApiRequest, NextApiResponse } from 'next';
import { CreateUser, User } from '~/shared/types';
import prisma from '~/prisma';
import * as bcrypt from 'bcrypt';

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
      return res
        .status(405)
        .send(
          `${req.method} is not a valid method. Only GET and POST requests are valid!`,
        );
    }
  } catch (e) {
    return errorFound(res, e);
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
  await isEmailValid(userDetails.email);

  const password = await hashPassword(userDetails.password);
  const addedUser = await prisma.user.create({
    data: {
      email: userDetails.email,
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

export function errorFound(res: NextApiResponse, e: unknown) {
  if (e instanceof Error) {
    if (e.message.toLowerCase() === 'no gift found') {
      return res.status(400).send('Gift was not found!');
    }
    if (e.message === 'Invalid email!') {
      return res.status(400).send(e.message);
    }
    if (e.message === 'Email is used already!') {
      return res.status(400).send(e.message);
    }
    if (e.cause === 'idError') return res.status(400).send('Invalid ID!');
    return res.status(500).send('Server error!');
  }

  return res.status(500).send('Unexpected error occurred!');
}

async function isEmailValid(emailAddress: string): Promise<boolean> {
  const checkedEmailAddress = emailAddress
    .toLowerCase()
    .match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
  if (checkedEmailAddress === null) {
    throw new Error('Invalid email!');
  }

  // checking if email exists in database
  const isEmailFound = await prisma.user.findUnique({
    where: {
      email: emailAddress,
    },
  });

  // email exists already
  if (isEmailFound) {
    throw new Error('Email is used already!');
  }

  // email is ready to be used
  return true;
}

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}
