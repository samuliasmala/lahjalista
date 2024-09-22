import { google } from 'googleapis';
import { readFileSync } from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';

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
  const googleApi = new GoogleApi(
    '1mjyeqn3MpaT8mFEN4yHbtOQFK9_KAeCElSaftviKPXE',
  );
  googleApi.printThisOut().printThisOut2();
  console.log('\n\n\n--------\n', googleApi, '\n--------\n\n\n');
  res.status(200).send('Kaikki ok!');
  return;
}

async function testFunction() {
  /*
    const s: GoogleAccount = JSON.parse(
    readFileSync('steady-scope-436117-p2-f407b01106c9.json', 'utf8'),
  );
  */

  const sheets = google.sheets({ version: 'v4', auth: auth });
  //const authClient = await auth.getClient();
  //console.log(authClient);
  //google.options({ auth: authClient });

  const res = await sheets.spreadsheets.values.get({
    key: 'AIzaSyD4IPgXs7ykfWTi7GiijVWaOQSbf2dTiFM',
    spreadsheetId: '1mjyeqn3MpaT8mFEN4yHbtOQFK9_KAeCElSaftviKPXE',
    range: 'Taulukko1!A1:B35',
  });
  /*
  const res = await sheets.spreadsheets.get({
    key: 'AIzaSyAGx2RzancL5B3iyUbyYJ8y44fFVYu1_4E',
    spreadsheetId: '1mjyeqn3MpaT8mFEN4yHbtOQFK9_KAeCElSaftviKPXE',
    range: 'Taulukko1!A1:B35'
  });
  */

  const res2 = await sheets.spreadsheets.values.append({
    key: 'AIzaSyAGx2RzancL5B3iyUbyYJ8y44fFVYu1_4E',
    spreadsheetId: '1mjyeqn3MpaT8mFEN4yHbtOQFK9_KAeCElSaftviKPXE',
  });

  console.log(res.data);
  console.log(res2);
}

class GoogleApi {
  spreadsheetId: string;

  constructor(spreadsheetId: string) {
    this.spreadsheetId = spreadsheetId;
  }

  printThisOut() {
    console.log(`This is the spreadsheet's ID: ${this.spreadsheetId}`);
    this.printThisOut2();
    return this;
  }

  printThisOut2() {
    console.log('This one was printed from another method!');
    return this;
  }
}

class HttpError2 extends Error {
  httpStatusCode: number;

  constructor(message: string, httpStatusCode: number) {
    super(message);
    this.httpStatusCode = httpStatusCode;
    this.name = this.constructor.name;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
