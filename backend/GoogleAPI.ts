import { google } from 'googleapis';
import { User } from '~/shared/types';
import { z } from 'zod';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

const PATH_TO_KEY_FILE = process.env.GOOGLE_SERVICE_ACCOUNT_JSON_FILE;

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

const jwtInputSchema = z.object({
  type: z.string(),
  project_id: z.string(),
  private_key_id: z.string(),
  private_key: z.string(),
  client_email: z.string().email(),
  client_id: z.string(),
});

export async function sendFeedbackToGoogleSheets({
  feedbackText,
  userDetails,
}: {
  feedbackText: string;
  userDetails: User;
}) {
  try {
    const credentialsOrKeyFile = getGoogleCredentials();
    console.log(credentialsOrKeyFile);
    if (credentialsOrKeyFile === null) {
      console.log(
        'No valid Google credentials found in env variables, skipping sending feedback to Google Sheets!',
      );
      return;
    }
    const AUTHENTICATION = new google.auth.GoogleAuth({
      ...credentialsOrKeyFile,
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

function getGoogleCredentials() {
  // GOOGLE_SERVICE_ACCOUNT_CREDENTIALS is prioritized over PATH_TO_KEY_FILE
  if (process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS) {
    const credentialsEnvParse = jwtInputSchema.safeParse(
      JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS),
    );

    if (credentialsEnvParse.success === true)
      return { credentials: credentialsEnvParse.data };

    console.error(
      'Environment variable: GOOGLE_SERVICE_ACCOUNT_CREDENTIALS is invalid!',
      credentialsEnvParse.error,
    );
    return null;
  }

  if (PATH_TO_KEY_FILE) return { keyFile: PATH_TO_KEY_FILE };

  return null;
}
