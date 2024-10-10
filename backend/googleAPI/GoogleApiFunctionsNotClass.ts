import { google } from 'googleapis';

const SCOPES = [
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/spreadsheets',
];

const PATH_TO_KEY_FILE =
  'backend/googleAPI/serviceAccountData/steady-scope-436117-p2-f407b01106c9.json';

const SPREADSHEET_ID = '1mjyeqn3MpaT8mFEN4yHbtOQFK9_KAeCElSaftviKPXE';

const AUTHENTICATION = new google.auth.GoogleAuth({
  keyFile: PATH_TO_KEY_FILE,
  scopes: SCOPES,
});

const SHEETS = google.sheets({
  version: 'v4',
  auth: AUTHENTICATION,
});

// same as appendData method
export async function sendFeedbackToGoogleSheets(props: {
  feedbackText: string;
  userUUID: string;
}) {
  const date = `${new Date().toLocaleDateString('fi-FI')} ${new Date().toTimeString()}`;
  await SHEETS.spreadsheets.values.append({
    auth: AUTHENTICATION,
    spreadsheetId: SPREADSHEET_ID,
    range: `Palautteet!A:C`,
    requestBody: {
      majorDimension: 'ROWS',
      values: [[props.feedbackText, props.userUUID, date]],
    },
    valueInputOption: 'USER_ENTERED',
  });
}
