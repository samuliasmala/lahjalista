import { NextApiRequest, NextApiResponse } from 'next';
import { Gift } from '../..';
import { PrismaClient } from '@prisma/client';
//import { prisma } from '~/lib/prismaClient';

const prisma = new PrismaClient();

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
  if (reqHandler) {
    await reqHandler(req, res);
    closePrismaConnection();
  } else {
    return res
      .status(405)
      .send(
        `${req.method} is not a valid method. Only GET and POST requests are valid!`,
      );
  }
}

async function handleGET(req: NextApiRequest, res: NextApiResponse) {
  try {
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
  } catch (e) {
    if (e instanceof Error) {
      console.log(e);
      return res.status(500).send('Palvelin virhe!');
    }
    return res.status(500).send('Odottamaton virhe tapahtui!');
  }
}

async function handlePOST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const giftData: Gift = req.body;
    console.log(giftData);
    const gift = await prisma.gift.create({
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

    return res.status(200).json(gift as Gift);
  } catch (e) {
    if (e instanceof Error) {
      console.log(e);
      return res.status(500).send('Palvelin virhe!');
    }
    return res.status(500).send('Odottamaton virhe tapahtui!');
  }
}

async function closePrismaConnection() {
  try {
    await prisma.$disconnect();
  } catch (e) {
    throw new Error('Failed to close Prisma connection', {
      cause: 'prismaDisconnectionFailed',
    });
  }
}
