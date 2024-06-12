import { NextApiRequest, NextApiResponse } from 'next';
import { CreateFeedback, Feedback, User } from '~/shared/types';
import prisma from '~/prisma';
import { handleError } from '~/backend/handleError';
import { HttpError } from '~/backend/HttpError';
import { createFeedbackSchema } from '~/shared/zodSchemas';
import { z } from 'zod';
import { deleteFeedbackSession, getFeedbackSession } from '~/backend/feedback';

const HANDLER: Record<
  string,
  (req: NextApiRequest, res: NextApiResponse) => Promise<void>
> = {
  GET: handleGET,
  POST: handlePOST,
};

export default async function handleFeedback(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    /*
  const { session } = await validateRequest(req, res);
  if (!session) {
    throw new HttpError('Unauthorized', 401);
  }
  */
    const reqHandler = req.method !== undefined && HANDLER[req.method];
    if (reqHandler) {
      await reqHandler(req, res);
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

async function handleGET(req: NextApiRequest, res: NextApiResponse) {
  return res.status(200).send('Not in use yet');
}

async function handlePOST(req: NextApiRequest, res: NextApiResponse) {
  const feedbackParse = createFeedbackSchema.safeParse(req.body);
  if (feedbackParse.success !== true) {
    return res
      .status(400)
      .send(
        `${feedbackParse.error.issues[0].path[0]} was invalid!` ||
          'Feedback text or UUID code was invalid!',
      );
  }
  const isFeedbackSessionFound: Boolean =
    (await getFeedbackSession(feedbackParse.data.uuid)) === null ? false : true;

  if (!isFeedbackSessionFound) {
    return res.status(400).send('UUID was invalid!');
  }

  const addedFeedback = await createFeedback(feedbackParse.data);

  if (addedFeedback) {
    await deleteFeedbackSession(feedbackParse.data.uuid);
  }
  return res.status(200).json(addedFeedback);
}

async function createFeedback(feedback: CreateFeedback) {
  const addedFeedback = prisma.feedback.create({
    data: {
      feedbackText: feedback.feedbackText,
    },
  });

  return addedFeedback;
}
