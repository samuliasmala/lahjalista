import { NextApiRequest, NextApiResponse } from 'next';
import { CreateUser, User } from '~/shared/types';
import prisma from '~/prisma';

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

  const addedUser = await prisma.user.create({
    data: {
      email: userDetails.email,
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
      password: userDetails.password,
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
    .match(
      /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g,
    );
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
