import { Gift } from '~/shared/types';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '~/prisma';
import { handleError } from '~/backend/handleError';
import { HttpError } from '~/backend/HttpError';
import { updateGiftSchema, uuidParseSchema } from '~/shared/zodSchemas';
import { requireLogin } from '~/backend/auth';
import { User as LuciaUser } from 'lucia';

type HandlerParams<ResponseType = unknown> = {
  req: NextApiRequest;
  res: NextApiResponse<ResponseType>;
  giftUUID: string;
  userData: LuciaUser;
};

const HANDLERS: Record<string, (params: HandlerParams) => Promise<void>> = {
  GET: handleGET,
  PATCH: handlePATCH,
  PUT: handlePUT,
  DELETE: handleDELETE,
};

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { user: userData } = await requireLogin(req, res);

    const reqHandler = req.method !== undefined && HANDLERS[req.method];
    if (reqHandler) {
      const giftUUID = uuidParseSchema.parse(req.query.uuid);

      await reqHandler({
        req,
        res,
        giftUUID,
        userData,
      });
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

async function handleGET({ res, giftUUID, userData }: HandlerParams<Gift>) {
  const gift = await prisma.gift.findUniqueOrThrow({
    where: {
      uuid: giftUUID,
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
  return res.status(200).json(gift);
}

async function handlePATCH({
  req,
  res,
  giftUUID,
  userData,
}: HandlerParams<Gift>) {
  const giftData = updateGiftSchema.parse(req.body);

  const updatedGift = await prisma.gift.update({
    where: {
      uuid: giftUUID,
      userUUID: userData.uuid,
    },
    data: giftData,
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

async function handlePUT({
  req,
  res,
  giftUUID,
  userData,
}: HandlerParams<Gift>) {
  const giftData = updateGiftSchema.parse(req.body);

  const updatedGift = await prisma.gift.update({
    where: {
      uuid: giftUUID,
      userUUID: userData.uuid,
    },
    data: giftData,
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

async function handleDELETE({ res, giftUUID, userData }: HandlerParams) {
  await prisma.gift.delete({
    where: {
      uuid: giftUUID,
      userUUID: userData.uuid,
    },
  });

  res.status(200).end();
  return;
}
