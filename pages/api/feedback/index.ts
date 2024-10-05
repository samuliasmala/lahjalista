import { NextApiRequest, NextApiResponse } from 'next';
import { CreateFeedback } from '~/shared/types';
import prisma from '~/prisma';
import { handleError } from '~/backend/handleError';
import { HttpError } from '~/backend/HttpError';
import { createFeedbackSchema } from '~/shared/zodSchemas';
import { Session, User } from 'lucia';
import { validateRequest } from '~/backend/auth';
import { sendFeedbackToGoogleSheets } from '~/backend/googleAPI/GoogleApiFunctionsNotClass';

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
// tämä alla oleva rivi lisätty, jotta "@typescript-eslint/require-await"-virheen pystyi ohittamaan väliaikaisesti
// handleGET-funktio laitetaan toimimaan myöhemmässä vaiheessa
async function handleGET(
  req: NextApiRequest,
  res: NextApiResponse,
  userData: User,
) {
  if (userData.role !== 'ADMIN') {
    throw new HttpError("You don't have privileges to do that!", 403);
  }

  const feedbacks = await prisma.feedback.findMany();
  console.log(feedbacks);

  return res.status(200).json(feedbacks);
}

async function handlePOST(
  req: NextApiRequest,
  res: NextApiResponse,
  userData: User,
) {
  const parsedFeedback = createFeedbackSchema.parse(req.body);
  const createdFeedback = await createFeedback(parsedFeedback, userData);

  // Code below should be okay to use void. Await would stop code here and it will not return any kind of error.
  // So .then or .catch should not be needed
  void sendFeedbackToGoogleSheets({
    feedbackText: parsedFeedback.feedbackText,
    userUUID: userData.uuid,
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

async function checkIfSessionValid(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<{ user: User; session: Session }> {
  const userData = await validateRequest(req, res);
  if (!userData.session || !userData.user) {
    throw new HttpError('You are unauthorized!', 401);
  }
  return userData;
}
