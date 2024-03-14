import { NextApiRequest, NextApiResponse } from 'next';
import { CreateGift, Gift } from '~/shared/types';
import prisma from '~/prisma';
import { handleError } from '~/backend/handleError';
import { HttpError } from '~/backend/HttpError';

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

async function handleGET(req: NextApiRequest, res: NextApiResponse<Gift[]>) {
  const gifts = await prisma.gift.findMany({
    select: {
      createdAt: true,
      gift: true,
      receiver: true,
      updatedAt: true,
      uuid: true,
    },
  });

  return res.status(200).json(gifts);
}

async function handlePOST(req: NextApiRequest, res: NextApiResponse<Gift>) {
  const giftData = req.body as CreateGift;
  const addedGift = await prisma.gift.create({
    data: {
      gift: giftData.gift,
      receiver: giftData.receiver,
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
