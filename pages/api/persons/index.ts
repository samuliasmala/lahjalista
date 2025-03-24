import { NextApiRequest, NextApiResponse } from 'next';
import { requireLogin } from '~/backend/auth';
import { handleError } from '~/backend/handleError';
import { HttpError } from '~/backend/HttpError';
import { User } from '~/shared/types';
import prisma from '~/prisma/index';
import { createPersonSchema, personSchema } from '~/shared/zodSchemas';

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
  const personData = await prisma.person.findMany({
    where: {
      userUUID: userData.uuid,
    },
    select: {
      uuid: true,
      name: true,
      sendReminders: true,
      // CHECK THIS, onko tarpeellista palauttaa PersonPicture tässä
      PersonPicture: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return res.status(200).json(personData);
}

async function handlePOST(
  req: NextApiRequest,
  res: NextApiResponse,
  userData: User,
) {
  const { name, sendReminders } = createPersonSchema.parse(req.body);

  const addedPerson = await prisma.person.create({
    data: {
      name,
      sendReminders,
      userUUID: userData.uuid,
    },
    select: {
      uuid: true,
      name: true,
      sendReminders: true,
      // CHECK THIS, onko tarpeellista palauttaa PersonPicture tässä
      PersonPicture: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return res.status(200).json(addedPerson);
}
