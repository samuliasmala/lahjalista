import { Anniversary, Gift, User } from '~/shared/types';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '~/prisma';
import { handleError } from '~/backend/handleError';
import { HttpError } from '~/backend/HttpError';
import {
  patchAnniversarySchema,
  putAnniversarySchema,
  updateGiftSchema,
  uuidParseSchema,
} from '~/shared/zodSchemas';
import { requireLogin } from '~/backend/auth';

type HandlerParams<ResponseType = unknown> = {
  req: NextApiRequest;
  res: NextApiResponse<ResponseType>;
  anniversaryUUID: string;
  userData: User;
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
    const { user: userData } = await requireLogin(req, res);

    const reqHandler = req.method !== undefined && HANDLERS[req.method];
    if (reqHandler) {
      const anniversaryUUID = uuidParseSchema.parse(req.query.uuid);

      await reqHandler({
        req,
        res,
        anniversaryUUID,
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

async function handleGET({
  res,
  anniversaryUUID,
  userData,
}: HandlerParams<Anniversary>) {
  const anniversary = await prisma.anniversary.findUniqueOrThrow({
    where: {
      uuid: anniversaryUUID,
      Person: { userUUID: userData.uuid },
    },
    select: {
      uuid: true,
      name: true,
      date: true,
      personUUID: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return res.status(200).json(anniversary);
}

async function handlePATCH({
  req,
  res,
  anniversaryUUID,
  userData,
}: HandlerParams<Anniversary>) {
  const anniversaryData = patchAnniversarySchema.parse(req.body);

  const updatedAnniversary = await prisma.anniversary.update({
    where: {
      uuid: anniversaryUUID,
      Person: {
        userUUID: userData.uuid,
      },
    },
    data: anniversaryData,
    select: {
      uuid: true,
      name: true,
      date: true,
      personUUID: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return res.status(200).json(updatedAnniversary);
}

async function handlePUT({
  req,
  res,
  anniversaryUUID,
  userData,
}: HandlerParams<Anniversary>) {
  const anniversaryData = putAnniversarySchema.parse(req.body);

  const updatedAnniversary = await prisma.anniversary.update({
    where: {
      uuid: anniversaryUUID,
      Person: {
        userUUID: userData.uuid,
      },
    },
    data: anniversaryData,
    select: {
      uuid: true,
      name: true,
      date: true,
      personUUID: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return res.status(200).json(updatedAnniversary);
}

async function handleDELETE({ res, anniversaryUUID, userData }: HandlerParams) {
  await prisma.anniversary.delete({
    where: {
      uuid: anniversaryUUID,
      Person: {
        userUUID: userData.uuid,
      },
    },
  });

  res.status(200).end();
  return;
}
