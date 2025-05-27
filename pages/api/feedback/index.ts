import { NextApiRequest, NextApiResponse } from 'next';
import { CreateFeedback, User } from '~/shared/types';
import prisma from '~/prisma';
import { handleError } from '~/backend/handleError';
import { HttpError } from '~/backend/HttpError';
import { createFeedbackSchema } from '~/shared/zodSchemas';
import { sendFeedbackToGoogleSheets } from '~/backend/GoogleAPI';
import { checkIfSessionValid } from '~/backend/auth';

const HANDLER: Record<
  string,
  (req: NextApiRequest, res: NextApiResponse, userData: User) => Promise<void>
> = {
  GET: handleGET,
  POST: handlePOST,
};

export default async function handleFeedback(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { user: userData } = await checkIfSessionValid(req, res);

    const reqHandler = req.method !== undefined && HANDLER[req.method];
    if (reqHandler) {
      await reqHandler(req, res, userData);
    } else {
      throw new HttpError(
        `${req.method} is not a valid method. Only GET and POST requests are valid!`,
        405,
      );
    }
  } catch (e) {
    return handleError(res, e);
  }
}

async function handleGET(
  req: NextApiRequest,
  res: NextApiResponse,
  userData: User,
) {
  if (userData.role !== 'ADMIN') {
    throw new HttpError("You don't have privileges to do that!", 403);
  }

  const includeUserQuery = req.query.includeUser;
  if (includeUserQuery == 'true') {
    const feedbacks = await prisma.feedback.findMany({
      select: {
        uuid: true,
        feedbackText: true,
        userUUID: true,
        createdAt: true,
        updatedAt: true,
        // Fetch User's data
        User: {
          select: {
            uuid: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return res.status(200).json(feedbacks);
  }

  const feedbacks = await prisma.feedback.findMany();

  return res.status(200).json(feedbacks);
}

async function handlePOST(
  req: NextApiRequest,
  res: NextApiResponse,
  userData: User,
) {
  const parsedFeedback = createFeedbackSchema.parse(req.body);
  const createdFeedback = await createFeedback(parsedFeedback, userData);

  sendFeedbackToGoogleSheets({
    feedbackText: parsedFeedback.feedbackText,
    userDetails: userData,
  }).catch((e) => {
    console.error(e);
  });

  return res.status(200).json(createdFeedback);
}

async function createFeedback(feedback: CreateFeedback, userData: User) {
  const addedFeedback = prisma.feedback.create({
    data: {
      feedbackText: feedback.feedbackText,
      userUUID: userData.uuid,
    },
    select: {
      feedbackText: true,
      createdAt: true,
    },
  });

  return addedFeedback;
}
