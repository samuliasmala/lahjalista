import { Person, User } from '~/shared/types';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '~/prisma';
import { handleError } from '~/backend/handleError';
import { HttpError } from '~/backend/HttpError';
import {
  getPersonSchema,
  patchPersonSchema,
  putPersonSchema,
  uuidParseSchema,
} from '~/shared/zodSchemas';
import { requireLogin } from '~/backend/auth';

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

async function handleGET({ res, personUUID, userData }: HandlerParams<Person>) {
  const personData = await prisma.person.findUniqueOrThrow({
    where: {
      uuid: personUUID,
      userUUID: userData.uuid,
    },
    select: {
      uuid: true,
      name: true,
      sendReminders: true,
      PersonPicture: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return res.status(200).json(personData);
}

async function handlePATCH({
  req,
  res,
  personUUID,
  userData,
}: HandlerParams<Person>) {
  const personData = patchPersonSchema.parse(req.body);

  const updatedPerson = await prisma.person.update({
    where: {
      uuid: personUUID,
      userUUID: userData.uuid,
    },
    data: personData,
    select: {
      uuid: true,
      name: true,
      sendReminders: true,
      PersonPicture: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return res.status(200).json(updatedPerson);
}

async function handlePUT({
  req,
  res,
  personUUID,
  userData,
}: HandlerParams<Person>) {
  const personData = putPersonSchema.parse(req.body);

  const updatedPerson = await prisma.person.update({
    where: {
      uuid: personUUID,
      userUUID: userData.uuid,
    },
    data: personData,
    select: {
      uuid: true,
      name: true,
      sendReminders: true,
      PersonPicture: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return res.status(200).json(updatedPerson);
}

async function handleDELETE({
  res,
  personUUID,
  userData,
}: HandlerParams<Person>) {
  await prisma.person.delete({
    where: {
      uuid: personUUID,
      userUUID: userData.uuid,
    },
  });
  res.status(200).end();
  return;
}
