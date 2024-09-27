import { NextApiRequest, NextApiResponse } from 'next';
import { CreateUser, User } from '~/shared/types';
import prisma from '~/prisma';
import { handleError } from '~/backend/handleError';
import { hashPassword } from '~/backend/utils';
import { HttpError } from '~/backend/HttpError';
import { createUserSchema } from '~/shared/zodSchemas';
import { requireLogin } from '~/backend/auth';

type HandlerParams<ResponseType = unknown> = {
  req: NextApiRequest;
  res: NextApiResponse<ResponseType>;
  userData: User;
};

const HANDLER: Record<string, (params: HandlerParams) => Promise<void>> = {
  GET: handleGET,
  POST: handlePOST,
};

export default async function handlePrisma(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { user: userData } = await requireLogin(req, res);

    const reqHandler = req.method !== undefined && HANDLER[req.method];
    if (reqHandler) {
      await reqHandler({ req, res, userData });
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

async function handleGET({ res, userData }: HandlerParams<User[]>) {
  if (userData.role !== 'ADMIN') {
    throw new HttpError("You don't have privileges to do that!", 403);
  }
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

// CHECK THIS, voiko tämän poistaa / lisätä, että ei käytössä? Tiliä ei voi luoda, koska ei ole kirjautunut sisään
// Rekistöröityminen tapahtuu /pages/api/auth/register.ts:n kautta
// /pages/api/auth/register.ts käyttä createUser-funktiota alempana
async function handlePOST({ req, res }: HandlerParams<User>) {
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
