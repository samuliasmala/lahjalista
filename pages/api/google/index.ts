import { NextApiRequest, NextApiResponse } from 'next';
import {
  GoogleApiAuthentication,
  GoogleApiSheets,
} from '~/backend/googleAPI/GoogleApi';
import { HttpError } from '~/backend/HttpError';

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
  throw new HttpError(`This API endpoint is not currently in use!`, 405);
}

export async function handleDataSendingToGoogleSheets(
  res: NextApiResponse,
  requiredData: { feedbackText: string; userUUID: string },
) {
  try {
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
      date: new Date().toLocaleDateString('fi-FI'),
      feedback: requiredData.feedbackText,
      userUUID: requiredData.userUUID,
    });

    res.status(200).send('Request sent succesfully!');
  } catch (e) {
    //console.error(e);
  }
}
