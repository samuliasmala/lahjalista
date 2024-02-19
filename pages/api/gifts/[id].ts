import { PrismaClient } from '@prisma/client';
import { Gift } from '../..';
import { NextApiRequest, NextApiResponse } from 'next';
//import { globalPrismaClient } from '~/lib/prismaClient';

const prisma = new PrismaClient();

type HandlerParams = {
  req: NextApiRequest;
  res: NextApiResponse;
  queryId: string;
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
  const reqHandler = req.method !== undefined && HANDLERS[req.method];
  if (reqHandler) {
    if (typeof req.query.id !== 'string') {
      throw new Error('Invalid ID', { cause: 'idError' });
    }
    const queryId = req.query.id;
    await reqHandler({ req, res, queryId });
  } else {
    return res
      .status(405)
      .send(
        `${req.method} is not a valid method. GET, PATCH, PUT and DELETE request are valid.`,
      );
  }
}

async function handleGET({ res, queryId }: HandlerParams) {
  try {
    const gift = await prisma.gift.findFirstOrThrow({
      where: {
        uuid: queryId,
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
  } catch (e) {
    return errorFound(res, e);
  }
}

async function handlePATCH({ req, res, queryId }: HandlerParams) {
  try {
    const newGiftData = req.body as Gift;

    const updatedGift = (await prisma.gift.update({
      where: {
        uuid: queryId,
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
  } catch (e) {
    return errorFound(res, e);
  }
}

async function handlePUT({ req, res, queryId }: HandlerParams) {
  try {
  } catch (e) {
    return errorFound(res, e);
  }
}

async function handleDELETE({ req, res, queryId }: HandlerParams) {
  try {
    // POISTOON KUN SAADAAN VARMUUS ID:N KÄYTÖSTÄ
    /*
    const queryID = isQueryIdNumber(req.query.id);
    if (queryID === undefined) {
      throw new Error(`Invalid ID: ${queryID}`, { cause: 'idError' });
    }
    */

    await prisma.gift.delete({
      where: {
        uuid: queryId,
      },
    });

    res.status(200).end();
    return;
  } catch (e) {
    console.log(e);
    return errorFound(res, e);
  }
}

function errorFound(res: NextApiResponse, e: unknown) {
  if (e instanceof Error) {
    if (e.cause === 'idError') return res.status(400).send('Virheellinen ID!');
    return res.status(500).send('Palvelin virhe!');
  }

  return res.status(500).send('Odottamaton virhe tapahtui!');
}

// POISTOON KUN SAADAAN VARMUUS ID:N KÄYTÖSTÄ
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
