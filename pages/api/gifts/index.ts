import { NextApiRequest, NextApiResponse } from 'next';
import { CreateGift } from '../..';
import { Gift } from '~/shared/types';
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
  const reqHandler = req.method !== undefined && HANDLER[req.method];
  try {
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

async function handleGET(req: NextApiRequest, res: NextApiResponse) {
  const gifts = await prisma.gift.findMany({
    select: {
      createdAt: true,
      gift: true,
      receiver: true,
      updatedAt: true,
      uuid: true,
    },
  });

  return res.status(200).json(gifts as Gift[]);
}

async function handlePOST(req: NextApiRequest, res: NextApiResponse) {
  const giftData: CreateGift = req.body as CreateGift;
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

  return res.status(200).json(addedGift as Gift);
}

export function errorFound(res: NextApiResponse, e: unknown) {
  if (e instanceof Error) {
    if (e.message.toLowerCase() === 'no gift found') {
      return res.status(400).send('Gift was not found!');
    }
    if (e.cause === 'idError') return res.status(400).send('Virheellinen ID!');
    return res.status(500).send('Palvelin virhe!');
  }

  return res.status(500).send('Odottamaton virhe tapahtui!');
}
