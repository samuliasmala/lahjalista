import { Cookie, TimeSpan } from 'lucia';
import { GetServerSidePropsContext } from 'next';
import prisma from '~/prisma';
import { User } from '~/shared/types';

export async function createFeedbackSession(
  context: GetServerSidePropsContext,
  userData: User,
) {
  const expirationTimeInMilliseconds =
    new Date().getTime() + new TimeSpan(1, 'h').milliseconds();
  const expirationTimeInISOSTRING = new Date(
    expirationTimeInMilliseconds,
  ).toISOString();

  const oldFeedbackSession = await prisma.feedbackSession.findUnique({
    where: {
      userUUID: userData.uuid,
    },
  });

  if (!oldFeedbackSession) {
    const newlyCreated = await prisma.feedbackSession.create({
      data: {
        expiresAt: expirationTimeInISOSTRING,
        userUUID: userData.uuid,
      },
    });
    const appendableCookie = new Cookie('feedback-session', newlyCreated.uuid, {
      maxAge: 3600,
    }).serialize();
    return context.res.setHeader('Set-cookie', appendableCookie);
  }

  if (oldFeedbackSession) {
    await prisma.feedbackSession.update({
      where: {
        uuid: oldFeedbackSession.uuid,
      },
      data: {
        expiresAt: expirationTimeInISOSTRING,
      },
    });
    const appendableCookie = new Cookie(
      'feedback-session',
      oldFeedbackSession.uuid,
      { maxAge: 3600 },
    ).serialize();
    return context.res.setHeader('Set-cookie', appendableCookie);
  }

  return context.res.writeHead(400).end();
}

export async function deleteFeedbackSession(feedbackSessionUUID: string) {
  await prisma.feedbackSession.delete({
    where: {
      uuid: feedbackSessionUUID,
    },
  });
  return;
}

export async function getFeedbackSession(feedbackSessionUUID: string) {
  const feedbackSession = await prisma.feedbackSession.findFirst({
    where: {
      uuid: feedbackSessionUUID,
    },
  });

  return feedbackSession;
}
