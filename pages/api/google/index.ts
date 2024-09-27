import { NextApiRequest, NextApiResponse } from 'next';
import {
  GoogleApiAuthentication,
  GoogleApiSheets,
} from '~/backend/googleAPI/GoogleApi';
import { z } from 'zod';
import { handleError } from '~/backend/handleError';
import { HttpError } from '~/backend/HttpError';
import { feedbackSchema } from '~/shared/zodSchemas';

const SCOPES = [
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/spreadsheets',
];

const PATH_TO_KEY_FILE =
  'backend/googleAPI/serviceAccountData/steady-scope-436117-p2-f407b01106c9.json';

const SPREADSHEET_ID = '1mjyeqn3MpaT8mFEN4yHbtOQFK9_KAeCElSaftviKPXE';

export default async function handleFunction(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method === 'POST') {
      await handleDataAppending(req, res);
    } else {
      throw new HttpError(
        `${req.method} is not a valid method. Only POST requests are valid!`,
        405,
      );
    }

    res.status(200).send('Kaikki ok!');
    return;
  } catch (e) {
    return handleError(res, e);
  }
}

async function handleDataAppending(req: NextApiRequest, res: NextApiResponse) {
  try {
    const parsedFeedback = feedbackSchema
      .pick({ feedbackText: true, feedbackUUID: true })
      .extend({ feedbackDate: z.string() })
      .parse(req.body);

    const authentication = await new GoogleApiAuthentication().authenticate({
      pathToKeyFile: PATH_TO_KEY_FILE,
      scopes: SCOPES,
    });

    const googleApiSheets = new GoogleApiSheets().initialize({
      auth: authentication.auth,
      sheetsVersion: 'v4',
      spreadsheetId: SPREADSHEET_ID,
      sheetName: 'Palautteet',
    });

    await googleApiSheets.appendData({
      date: parsedFeedback.feedbackDate,
      feedback: parsedFeedback.feedbackText,
      UUID: parsedFeedback.feedbackUUID,
    });

    res.status(200).send('Request sent succesfully!');
  } catch (e) {
    console.error(e);
    return handleError(res, e);
  }
}
