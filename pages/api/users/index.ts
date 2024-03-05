import { NextApiRequest, NextApiResponse } from 'next';
import { CreateGift, Gift, User } from '~/shared/types';
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
  try {
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
  } catch (e) {
    return errorFound(res, e);
  }
}

async function handleGET(req: NextApiRequest, res: NextApiResponse<User[]>) {
  const users = await prisma.user.findMany({
    select: {
      uuid: true,
      firstName: true,
      lastName: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return res.status(200).json(users);
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

export function errorFound(res: NextApiResponse, e: unknown) {
  if (e instanceof Error) {
    if (e.message.toLowerCase() === 'no gift found') {
      return res.status(400).send('Gift was not found!');
    }
    if (e.cause === 'idError') return res.status(400).send('Invalid ID!');
    return res.status(500).send('Server error!');
  }

  return res.status(500).send('Unexpected error occurred!');
}
