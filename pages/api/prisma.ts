import { PrismaClient } from '@prisma/client';
import { Gift } from '..';
import { NextApiRequest, NextApiResponse } from 'next';

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
    const gifts = await prisma.gift.findMany();
    //console.log(gifts);
    return res.status(200).json(gifts);
  } catch (e) {
    if (e instanceof Error) {
      return res.status(500).send('Palvelin virhe!');
    }
    return res.status(500).send('Odottamaton virhe tapahtui!');
  }
}

async function handlePOST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const giftData = req.body;
    console.log(giftData);
    const giftDataID = Math.floor(Math.random() * 10000000);
    console.log(giftDataID);
    const gift = await prisma.gift.create({
      data: {
        gift: giftData.gift,
        receiver: giftData.name,
      },
    });
    console.log(gift);
  } catch (e) {
    if (e instanceof Error) {
      return res.status(500).send('Palvelin virhe!');
    }
    return res.status(500).send('Odottamaton virhe tapahtui!');
  }
}
