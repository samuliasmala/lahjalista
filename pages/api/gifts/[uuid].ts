import { Gift } from '../..';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '~/utils/prismaClient';
import { errorFound } from '.';

type HandlerParams = {
  req: NextApiRequest;
  res: NextApiResponse;
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
        throw new Error('Invalid ID', { cause: 'idError' });
      }
      const queryUUID = req.query.uuid;
      await reqHandler({ req, res, queryUUID });
    } else {
      return res
        .status(405)
        .send(
          `${req.method} is not a valid method. GET, PATCH, PUT and DELETE request are valid.`,
        );
    }
  } catch (e) {
    return errorFound(res, e);
  }
}

async function handleGET({ res, queryUUID }: HandlerParams) {
  const gift = await prisma.gift.findFirstOrThrow({
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

async function handlePATCH({ req, res, queryUUID }: HandlerParams) {
  const newGiftData = req.body as Gift;

  const updatedGift = (await prisma.gift.update({
    where: {
      uuid: queryUUID,
    },
    data: {
      receiver: newGiftData['receiver'],
      gift: newGiftData['gift'],
    },
    select: {
      createdAt: true,
      gift: true,
      receiver: true,
      updatedAt: true,
      uuid: true,
    },
  })) as Gift;

  return res.status(200).json(updatedGift);
}

async function handlePUT({ req, res, queryUUID }: HandlerParams) {
  const newGiftData = req.body as Gift;

  const updatedGift = (await prisma.gift.update({
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
  })) as Gift;

  return res.status(200).json(updatedGift);
}

async function handleDELETE({ res, queryUUID }: HandlerParams) {
  // POISTOON KUN SAADAAN VARMUUS ID:N KÄYTÖSTÄ
  /*
    const queryID = isQueryIdNumber(req.query.id);
    if (queryID === undefined) {
      throw new Error(`Invalid ID: ${queryID}`, { cause: 'idError' });
    }
    */

  await prisma.gift.delete({
    where: {
      uuid: queryUUID,
    },
  });

  res.status(200).end();
  return;
}

// POISTOON KUN SAADAAN VARMUUS ID:N KÄYTÖSTÄ
/*
function isQueryIdNumber(
  reqQueryId: string | string[] | undefined,
): number | undefined {
  if (typeof reqQueryId !== 'string') {
    return undefined;
  }
  const compiledNumber = Number(reqQueryId);
  if (Number.isNaN(compiledNumber) === true) {
    return undefined;
  }
  return compiledNumber;
}
*/
