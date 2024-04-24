import { Gift } from '~/shared/types';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '~/prisma';
import { handleError } from '~/backend/handleError';
import { HttpError } from '~/backend/HttpError';
import { giftSchema } from '~/shared/zodSchemas';

type HandlerParams<ResponseType = unknown> = {
  req: NextApiRequest;
  res: NextApiResponse<ResponseType>;
  queryUUID: string;
};

const HANDLERS: Record<string, (params: HandlerParams) => Promise<void>> = {
  GET: handleGET,
  PATCH: handlePATCH,
  PUT: handlePUT,
  DELETE: handleDELETE,
};

export default async function handlePrisma(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const reqHandler = req.method !== undefined && HANDLERS[req.method];
    if (reqHandler) {
      if (typeof req.query.uuid !== 'string') {
        throw new HttpError('Invalid ID', 400);
      }
      const queryUUID = req.query.uuid;
      await reqHandler({ req, res, queryUUID });
    } else {
      throw new HttpError(
        `${req.method} is not a valid method. GET, PATCH, PUT and DELETE request are valid.`,
        405,
      );
    }
  } catch (e) {
    return handleError(res, e);
  }
}

async function handleGET({ res, queryUUID }: HandlerParams<Gift>) {
  const gift = await prisma.gift.findUniqueOrThrow({
    where: {
      uuid: queryUUID,
    },
    select: {
      createdAt: true,
      gift: true,
      receiver: true,
      updatedAt: true,
      uuid: true,
    },
  });
  return res.status(200).json(gift);
}

async function handlePATCH({ req, res, queryUUID }: HandlerParams<Gift>) {
  const { gift, receiver } = giftSchema
    .pick({ gift: true, receiver: true })
    .parse(req.body);

  const updatedGift = await prisma.gift.update({
    where: {
      uuid: queryUUID,
    },
    data: {
      receiver: receiver,
      gift: gift,
    },
    select: {
      createdAt: true,
      gift: true,
      receiver: true,
      updatedAt: true,
      uuid: true,
    },
  });

  return res.status(200).json(updatedGift);
}

async function handlePUT({ req, res, queryUUID }: HandlerParams<Gift>) {
  const newGiftData = giftSchema.parse(req.body);

  const updatedGift = await prisma.gift.update({
    where: {
      uuid: queryUUID,
    },
    data: newGiftData,
    select: {
      createdAt: true,
      gift: true,
      receiver: true,
      updatedAt: true,
      uuid: true,
    },
  });

  return res.status(200).json(updatedGift);
}

async function handleDELETE({ res, queryUUID }: HandlerParams) {
  await prisma.gift.delete({
    where: {
      uuid: queryUUID,
    },
  });

  res.status(200).end();
  return;
}
