import { NextApiRequest, NextApiResponse } from 'next';
import { requireLogin } from '~/backend/auth';
import { handleError } from '~/backend/handleError';
import { HttpError } from '~/backend/HttpError';
import { User } from '~/shared/types';
import prisma from '~/prisma/index';
import { createPersonSchema } from '~/shared/zodSchemas';

const HANDLER: Record<
  string,
  (req: NextApiRequest, res: NextApiResponse, userData: User) => Promise<void>
> = {
  GET: handleGET,
  POST: handlePOST,
};

export default async function handlePersons(
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
  console.log('get');

  return res.status(200).send('True');
}

async function handlePOST(
  req: NextApiRequest,
  res: NextApiResponse,
  userData: User,
) {
  const parsedUserData = createPersonSchema.parse(req.body);

  const addedPerson = await prisma.person.create({
    data: {
      name: parsedUserData.name,
      sendReminders: parsedUserData.sendReminders,
      userUUID: userData.uuid,
    },
    select: {
      name: true,
      sendReminders: true,
      uuid: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return res.status(200).json(addedPerson);
}
