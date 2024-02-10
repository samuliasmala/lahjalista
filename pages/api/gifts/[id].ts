import { PrismaClient } from '@prisma/client';
import { Gift } from '../..';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

const HANDLER: Record<
  string,
  (req: NextApiRequest, res: NextApiResponse) => Promise<void>
> = {
  GET: handleGET,
  PATCH: handlePATCH,
  PUT: handlePUT,
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
    let queryID: number;
    if (typeof req.query.id !== 'string') {
      throw new Error('Invalid ID', { cause: 'idError' });
    }
    queryID = Number(req.query.id);
    const gifts = await prisma.gift.findFirstOrThrow({
      where: {
        id: queryID,
      },
    });
    console.log(gifts);
    return res.status(200).json(gifts);
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
  } catch (e) {
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
