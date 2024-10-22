import { JWTInput } from 'google-auth-library';
import { google } from 'googleapis';
import { User } from '~/shared/types';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

const PATH_TO_KEY_FILE = process.env.GOOGLE_SERVICE_ACCOUNT_JSON_FILE;

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

export async function sendFeedbackToGoogleSheets({
  feedbackText,
  userDetails,
}: {
  feedbackText: string;
  userDetails: User;
}) {
  try {
    const AUTHENTICATION = process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS
      ? new google.auth.GoogleAuth({
          credentials: JSON.parse(
            process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS,
          ) as JWTInput,
          scopes: SCOPES,
        })
      : new google.auth.GoogleAuth({
          keyFile: PATH_TO_KEY_FILE,
          scopes: SCOPES,
        });

    const SHEETS = google.sheets({
      version: 'v4',
      auth: AUTHENTICATION,
    });

    const date = `${new Date().toLocaleDateString('fi-FI')} ${new Date().toTimeString()}`;
    const feedbackGiverDetails = `${userDetails.firstName} ${userDetails.lastName}\n${userDetails.email}`;
    await SHEETS.spreadsheets.values.append({
      auth: AUTHENTICATION,
      spreadsheetId: SPREADSHEET_ID,
      range: `Palautteet!A:C`,
      requestBody: {
        majorDimension: 'ROWS',
        values: [[feedbackText, feedbackGiverDetails, date]],
      },
      valueInputOption: 'USER_ENTERED',
    });
  } catch (e) {
    console.error(e);
  }
}
