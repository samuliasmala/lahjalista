import { NextApiRequest, NextApiResponse } from 'next';
import { CreateUser, User } from '~/shared/types';
import prisma from '~/prisma';
import * as bcrypt from 'bcrypt';
import { z } from 'zod';

const HANDLER: Record<
  string,
  (req: NextApiRequest, res: NextApiResponse) => Promise<void>
> = {
  GET: handleGET,
  POST: handlePOST,
};

const registerationUserSchema = z.object({
  email: z
    .string()
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Invalid email!',
    ),
  password: z.string().min(6, 'Password has to be at least 6 characters long!'),
});

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
  console.log('Got it ');
  const userDetails = req.body as CreateUser;
  console.log(userDetails);

  const parsedData = registerationUserSchema.parse(userDetails);

  await isEmailFree(parsedData.email);

  const password = await hashPassword(parsedData.password);
  const addedUser = await prisma.user.create({
    data: {
      email: parsedData.email,
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
  console.log(e);
  if (e instanceof Error) {
    if (e.message.toLowerCase() === 'no gift found') {
      return res.status(400).send('Gift was not found!');
    }
    if (e.message === 'Invalid email!') {
      return res.status(400).send(e.message);
    }
    if (e.message === 'Email is already in use!') {
      return res.status(400).send(e.message);
    }
    if (e.cause === 'idError') return res.status(400).send('Invalid ID!');
    return res.status(500).send('Server error!');
  }

  return res.status(500).send('Unexpected error occurred!');
}

async function isEmailFree(emailAddress: string): Promise<boolean> {
  // checking if email exists in database
  const isEmailFound = await prisma.user.findUnique({
    where: {
      email: emailAddress,
    },
  });

  // email exists already
  if (isEmailFound) {
    throw new Error('Email is already in use!');
  }

  // email is ready to be used
  return true;
}

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}
