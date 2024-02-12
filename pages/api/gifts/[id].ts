import { PrismaClient } from '@prisma/client';
import { Gift } from '../..';
import { NextApiRequest, NextApiResponse } from 'next';
//import { globalPrismaClient } from '~/lib/prismaClient';

const prisma = new PrismaClient();

const HANDLER: Record<
  string,
  (req: NextApiRequest, res: NextApiResponse) => Promise<void>
> = {
  GET: handleGET,
  PATCH: handlePATCH,
  PUT: handlePUT,
  DELETE: handleDELETE,
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
    const queryID = isQueryIdNumber(req.query.id);
    if (queryID === undefined) {
      throw new Error(`Invalid ID: ${queryID}`, { cause: 'idError' });
    }

    const gift = await prisma.gift.findFirstOrThrow({
      where: {
        id: queryID,
      },
    });
    return res.status(200).json(gift);
  } catch (e) {
    return errorFound(res, e);
  }
}

async function handlePATCH(req: NextApiRequest, res: NextApiResponse) {
  try {
  } catch (e) {
    return errorFound(res, e);
  }
}

async function handlePUT(req: NextApiRequest, res: NextApiResponse) {
  try {
  } catch (e) {
    return errorFound(res, e);
  }
}

async function handleDELETE(req: NextApiRequest, res: NextApiResponse) {
  try {
    const queryID = isQueryIdNumber(req.query.id);
    if (queryID === undefined) {
      throw new Error(`Invalid ID: ${queryID}`, { cause: 'idError' });
    }

    await prisma.gift.delete({
      where: {
        id: queryID,
      },
    });

    return res.status(200).send('Poistettu onnistuneesti!');
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
