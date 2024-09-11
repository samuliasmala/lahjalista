import { NextApiRequest, NextApiResponse } from 'next';
import { CreateFeedback } from '~/shared/types';
import prisma from '~/prisma';
import { handleError } from '~/backend/handleError';
import { HttpError } from '~/backend/HttpError';
import { createFeedbackSchema } from '~/shared/zodSchemas';
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
// tämä alla oleva rivi lisätty, jotta "@typescript-eslint/require-await"-virheen pystyi ohittamaan väliaikaisesti
// handleGET-funktio laitetaan toimimaan myöhemmässä vaiheessa
// eslint-disable-next-line
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
  const isFeedbackSessionFound: boolean =
    (await getFeedbackSession(feedbackParse.data.feedbackUUID)) === null
      ? false
      : true;

  if (!isFeedbackSessionFound) {
    return res.status(400).send('Feedback UUID was invalid!');
  }

  const addedFeedback = await createFeedback(feedbackParse.data);

  if (addedFeedback) {
    await deleteFeedbackSession(feedbackParse.data.feedbackUUID);
  }

  return res.status(200).json(addedFeedback);
}

async function createFeedback(feedback: CreateFeedback) {
  const addedFeedback = prisma.feedback.create({
    data: {
      feedbackText: feedback.feedbackText,
    },
    select: {
      feedbackText: true,
      createdAt: true,
    },
  });

  return addedFeedback;
}