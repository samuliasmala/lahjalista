import { google } from 'googleapis';
import { readFileSync } from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  GoogleApiAuthentication,
  GoogleApiSheets,
} from '~/backend/googleAPI/GoogleApi';
import { z } from 'zod';

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

const SCOPES = [
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/spreadsheets',
];

const PATH_TO_KEY_FILE = 'steady-scope-436117-p2-f407b01106c9.json';

export default async function handleFunction(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  /*
  const auth = new google.auth.GoogleAuth({
    keyFile: 'steady-scope-436117-p2-f407b01106c9.json',
    scopes: [
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/spreadsheets',
    ],
  });
  //await auth.getClient();


  const sheets = google.sheets({ version: 'v4', auth: auth });
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: '1mjyeqn3MpaT8mFEN4yHbtOQFK9_KAeCElSaftviKPXE',
    range: `Palautteet!A:A`,
  });
  console.log(response);
  console.log(response.data.values);
  */
  //await testFunction();
  /*
  const googleApi = new GoogleApiAuthentication({
    scopes: SCOPES,
    pathToKeyFile: PATH_TO_KEY_FILE,
  });
  */
  const authentication = await new GoogleApiAuthentication()
    //.authenticate({ pathToKeyFile: PATH_TO_KEY_FILE, scopes: SCOPES });
    .authenticate({ pathToKeyFile: PATH_TO_KEY_FILE, scopes: SCOPES });
  const googleApiSheets = new GoogleApiSheets().initialize({
    auth: authentication.auth,
    sheetsVersion: 'v4',
  });

  console.log('------\n\n\n\n', googleApiSheets, '\n\n\n\n-----');
  console.log('-----\n\n\n\n', authentication, '\n\n\n\n------');
  res.status(200).send('Kaikki ok!');
  return;
}

async function asd() {
  const auth = new google.auth.GoogleAuth({
    keyFile: 'steady-scope-436117-p2-f407b01106c9.json',
    scopes: [
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/spreadsheets',
    ],
  });
  await auth.getClient();

  const sheets = google.sheets({ version: 'v4', auth: auth });
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: '1mjyeqn3MpaT8mFEN4yHbtOQFK9_KAeCElSaftviKPXE',
    range: `Palautteet!A:A`,
  });
  console.log(response);
  console.log(response.data.values);
}
