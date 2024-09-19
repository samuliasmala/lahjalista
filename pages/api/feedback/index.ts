import { NextApiRequest, NextApiResponse } from 'next';
import { CreateFeedback } from '~/shared/types';
import prisma from '~/prisma';
import { handleError } from '~/backend/handleError';
import { HttpError } from '~/backend/HttpError';
import { createFeedbackSchema } from '~/shared/zodSchemas';
import { deleteFeedbackSession, getFeedbackSession } from '~/backend/feedback';
import { google } from 'googleapis';
import { readFileSync } from 'fs';

type GoogleAccount = {
  type: string;
  project_id: string;
  private_key_id: string;
  private_keys: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
  universe_domain: string;
};

async function testFunction() {
  const s: GoogleAccount = JSON.parse(
    readFileSync('test-project-434908-7338724a2dea.json', 'utf8'),
  );

  const auth = new google.auth.GoogleAuth({
    keyFile: 'test-project-434908-7338724a2dea.json',
    scopes: [
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/spreadsheets',
    ],
  });

  const sheets = google.sheets({ version: 'v4', auth: auth });
  //const authClient = await auth.getClient();
  //console.log(authClient);
  //google.options({ auth: authClient });

  /*
  const res = await sheets.spreadsheets.values.get({
    key: 'AIzaSyD4IPgXs7ykfWTi7GiijVWaOQSbf2dTiFM',
    spreadsheetId: '1uhy_1tgBnhBPiei_DjewbJOnhzphVilFOVAOouYB4JI',
    range: 'Taulukko1!A1:B35',
  });
  */
  const res = await sheets.spreadsheets.get({
    key: 'AIzaSyD4IPgXs7ykfWTi7GiijVWaOQSbf2dTiFM',
    spreadsheetId: '1uhy_1tgBnhBPiei_DjewbJOnhzphVilFOVAOouYB4JI',
  });

  console.log(res.data.sheets[0].data);
}

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
    testFunction();
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
