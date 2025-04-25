import { NextApiRequest, NextApiResponse } from 'next';
import { requireLogin } from '~/backend/auth';
import { handleError } from '~/backend/handleError';
import { HttpError } from '~/backend/HttpError';
import { User } from '~/shared/types';
import prisma from '~/prisma/index';
import { createAnniversarySchema } from '~/shared/zodSchemas';

const HANDLER: Record<
  string,
  (req: NextApiRequest, res: NextApiResponse, userData: User) => Promise<void>
> = {
  GET: handleGET,
  POST: handlePOST,
};

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { user: userData } = await requireLogin(req, res);

    const reqHandler = req.method !== undefined && HANDLER[req.method];
    if (reqHandler) {
      await reqHandler(req, res, userData);
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

async function handleGET(
  req: NextApiRequest,
  res: NextApiResponse,
  userData: User,
) {
  const anniversaries = await prisma.anniversary.findMany({
    where: {
      Person: { userUUID: userData.uuid },
    },
    select: {
      uuid: true,
      name: true,
      date: true,
      personUUID: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return res.status(200).json(anniversaries);
}

async function handlePOST(
  req: NextApiRequest,
  res: NextApiResponse,
  userData: User,
) {
  const { date, name, personUUID } = createAnniversarySchema.parse(req.body);

  const findIfPersonBelongsToUser = await prisma.person.findFirst({
    where: {
      uuid: personUUID,
      userUUID: userData.uuid,
    },
  });
  if (!findIfPersonBelongsToUser) {
    throw new HttpError('Henkilöä ei löytynyt tietokannasta!', 400);
  }

  const addedAnniversary = await prisma.anniversary.create({
    data: {
      date,
      name,
      personUUID,
    },
    select: {
      uuid: true,
      name: true,
      date: true,
      personUUID: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return res.status(200).json(addedAnniversary);
}
