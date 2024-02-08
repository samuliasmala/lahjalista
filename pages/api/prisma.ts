import { PrismaClient } from '@prisma/client';
import { Gift } from '..';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handleSomething(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    console.log(req.method);
    const giftData = req.body;
    console.log(giftData);
    const giftDataID = Math.floor(Math.random() * 10000000);
    console.log(giftDataID);
    const gift = await prisma.gift.create({
      data: {
        gift: giftData.gift,
        receiver: giftData.name,
        id: giftDataID,
        createdAt: new Date(),
      },
    });
    console.log(gift);
  }
  if (req.method === 'GET') {
    try {
      const gifts = await prisma.gift.findMany();
      console.log(gifts);
      return res.status(200).json(gifts);
    } catch (e) {
      if (e instanceof Error) {
        return res.status(500).send('Palvelin virhe!');
      }
    }
  }
  return res.status(200).send('Worked');
}
