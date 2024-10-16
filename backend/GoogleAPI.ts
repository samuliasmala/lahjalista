import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

const PATH_TO_KEY_FILE = process.env.GOOGLE_SERVICE_ACCOUNT_JSON_FILE;

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

const AUTHENTICATION = new google.auth.GoogleAuth({
  keyFile: PATH_TO_KEY_FILE,
  scopes: SCOPES,
});

const SHEETS = google.sheets({
  version: 'v4',
  auth: AUTHENTICATION,
});

// CHECK THIS, lisää käyttäjän UUID:n eikä muuta, onko ok?
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
