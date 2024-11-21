import { NextApiRequest, NextApiResponse } from 'next';
import { requireLogin } from '~/backend/auth';
import { handleError } from '~/backend/handleError';
import { HttpError } from '~/backend/HttpError';
import { User } from '~/shared/types';
import prisma from '~/prisma/index';

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
    console.log(userData);

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
  const personData = await prisma.person.findFirstOrThrow({
    where: {
      userUUID: userData.uuid,
    },
  });

  const anniversaryData = await prisma.anniversary.findMany({
    where: {
      personUUID: personData.uuid,
    },
  });

  console.log(personData);
  console.log('\n\n\n');
  console.log(anniversaryData);

  const returnableObject: {
    personData: typeof personData;
    anniversaryData: typeof anniversaryData;
  } = {
    personData,
    anniversaryData,
  };
  return res.status(200).json(returnableObject);
}

async function handlePOST(
  req: NextApiRequest,
  res: NextApiResponse,
  userData: User,
) {
  const addedPerson = await prisma.person.create({
    data: {
      name: 'John Doe',
      sendReminders: true,
      userUUID: userData.uuid,
    },
    select: {
      name: true,
      sendReminders: true,
    },
  });
  /*
    const giftData = createGiftSchema.parse(req.body);

  const addedGift = await prisma.gift.create({
    data: {
      ...giftData,
      userUUID: userData.uuid,
    },
    select: {
      createdAt: true,
      gift: true,
      receiver: true,
      updatedAt: true,
      uuid: true,
    },
  });

  */
  return res.status(200).json(addedPerson);
}
