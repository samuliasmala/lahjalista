import { NextApiRequest, NextApiResponse } from 'next';
import { CreateFeedback, Feedback, User } from '~/shared/types';
import prisma from '~/prisma';
import { handleError } from '~/backend/handleError';
import { HttpError } from '~/backend/HttpError';
import { createFeedbackSchema } from '~/shared/zodSchemas';
import { z } from 'zod';

const HANDLER: Record<
  string,
  (req: NextApiRequest, res: NextApiResponse) => Promise<void>
> = {
  GET: handleGET,
  POST: handlePOST,
};

export default async function handleLogout(
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

async function handleGET(req: NextApiRequest, res: NextApiResponse) {
  console.log('GET');

  return res.status(200).end();
}

async function handlePOST(req: NextApiRequest, res: NextApiResponse) {
  const feedbackParse = createFeedbackSchema.safeParse(req.body);
  if (feedbackParse.success !== true) {
    return res
      .status(400)
      .send(
        feedbackParse.error.format().feedbackText?._errors[0] ||
          'Feedback text was not valid!',
      );
  }
  const addedFeedback = await createFeedback(feedbackParse.data);
  console.log(addedFeedback);

  return res.status(200).json(addedFeedback);
  /*
  const { email, firstName, lastName, password } = createUserSchema.parse(
    req.body,
  );
  const addedUser = await createUser({
    email: email.toLowerCase(),
    firstName: firstName,
    lastName: lastName,
    password: password,
  });
  
  return res.status(200).json(addedUser);
  */
}

async function createFeedback(feedback: CreateFeedback) {
  console.log(feedback.feedbackText, 'asd');
  const addedFeedback = prisma.feedback.create({
    data: {
      feedbackText: feedback.feedbackText,
    },
  });

  return addedFeedback;
}
