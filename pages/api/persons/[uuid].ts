import { Gift, User } from '~/shared/types';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '~/prisma';
import { handleError } from '~/backend/handleError';
import { HttpError } from '~/backend/HttpError';
import {
  getAnniversarySchema,
  getPersonSchema,
  updateGiftSchema,
  uuidParseSchema,
  patchAnniversarySchema,
} from '~/shared/zodSchemas';
import { requireLogin } from '~/backend/auth';
import { z } from 'zod';

type HandlerParams<ResponseType = unknown> = {
  req: NextApiRequest;
  res: NextApiResponse<ResponseType>;
  personUUID: string;
  userData: User;
};

const HANDLERS: Record<string, (params: HandlerParams) => Promise<void>> = {
  GET: handleGET,
  PATCH: handlePATCH,
  PUT: handlePUT,
  DELETE: handleDELETE,
};

type PrismaHandlerParams<ResponseType = unknown> = {
  res: NextApiResponse<ResponseType>;
  name: string;
  date: Date;
  personUUID: string;
  userUUID: string;
  uuid: string;
};

const PRISMA_ACTION_HANDLERS: Record<
  string,
  (params: PrismaHandlerParams) => Promise<void>
> = {
  create: handlePrismaCreate,
  update: handlePrismaUpdate,
  delete: handlePrismaDelete,
};

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { user: userData } = await requireLogin(req, res);

    const reqHandler = req.method !== undefined && HANDLERS[req.method];
    if (reqHandler) {
      const personUUID = uuidParseSchema.parse(req.query.uuid);

      await reqHandler({
        req,
        res,
        personUUID,
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

async function handleGET({ res, personUUID, userData }: HandlerParams) {
  const personData = await prisma.person.findUniqueOrThrow({
    where: {
      uuid: personUUID,
      userUUID: userData.uuid,
    },
  });
  const parsedPersonData = getPersonSchema.parse(personData);

  const anniversariesOfPerson = await prisma.anniversary.findMany({
    where: {
      personUUID,
      userUUID: userData.uuid,
    },
  });
  console.log(anniversariesOfPerson, personUUID, userData.uuid);
  // ZOD HERE
  const parsedAnniversaries = z
    .array(getAnniversarySchema)
    .parse(anniversariesOfPerson);
  console.log(parsedAnniversaries);

  return res.status(200).json({ parsedPersonData, anniversariesOfPerson });
}

async function handlePATCH({ req, res, personUUID, userData }: HandlerParams) {
  console.log(req.body);
  const parsedAnniversaries = patchAnniversarySchema.parse(
    req.body.anniversary,
  );
  console.log(parsedAnniversaries);

  if (parsedAnniversaries) {
    const prismaActionHandler =
      PRISMA_ACTION_HANDLERS[parsedAnniversaries.action];

    const { date, name, uuid } = parsedAnniversaries;
    return await prismaActionHandler({
      res,
      date,
      name,
      personUUID,
      userUUID: userData.uuid,
      uuid,
    });
  }

  return res.status(200).send('Test2');
}

async function handlePUT({ req, res, personUUID, userData }: HandlerParams) {
  return res.status(200).send('Test3');
}

async function handleDELETE({ res, personUUID, userData }: HandlerParams) {
  return res.status(200).send('Test4');
}

/*
handle functions
*/

async function handlePrismaCreate({
  res,
  name,
  date,
  personUUID,
  userUUID,
}: PrismaHandlerParams) {
  const createdAnniversary = await prisma.anniversary.create({
    data: {
      name,
      date,
      personUUID,
      userUUID,
    },
  });
  // CHECK THIS, ZOD HERE!!!
  return res.status(200).json(createdAnniversary);
}

async function handlePrismaUpdate({
  res,
  name,
  date,
  uuid,
  personUUID,
  userUUID,
}: PrismaHandlerParams) {
  const updatedAnniversary = await prisma.anniversary.update({
    where: {
      uuid: uuid,
      personUUID: personUUID,
      userUUID: userUUID,
    },
    data: {
      name: name,
      date: date,
    },
  });
  console.log(updatedAnniversary);
  // CHECK THIS, ZOD HERE!!!
  return res.status(200).json(updatedAnniversary);
}

async function handlePrismaDelete({
  res,
  uuid,
  personUUID,
  userUUID,
}: PrismaHandlerParams) {
  await prisma.anniversary.delete({
    where: {
      uuid,
      personUUID,
      userUUID,
    },
  });
  return res.status(200).send('Success!');
}
