import { NextApiRequest, NextApiResponse } from 'next';
import { Gift } from '~/shared/types';
import prisma from '~/prisma';
import { handleError } from '~/backend/handleError';
import { HttpError } from '~/backend/HttpError';
import { requireLogin } from '~/backend/auth';
import { User as LuciaUser } from 'lucia';
import { createGiftSchema } from '~/shared/zodSchemas';

const HANDLER: Record<
  string,
  (
    req: NextApiRequest,
    res: NextApiResponse,
    userData: LuciaUser,
  ) => Promise<void>
> = {
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
  res: NextApiResponse<Gift[]>,
  userData: LuciaUser,
) {
  const gifts = await prisma.gift.findMany({
    select: {
      createdAt: true,
      gift: true,
      receiver: true,
      updatedAt: true,
      uuid: true,
    },
    where: {
      userUUID: userData.uuid,
    },
  });

  return res.status(200).json(gifts);
}

async function handlePOST(
  req: NextApiRequest,
  res: NextApiResponse<Gift>,
  userData: LuciaUser,
) {
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

  return res.status(200).json(addedGift);
}
