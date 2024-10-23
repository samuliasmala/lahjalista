import { google } from 'googleapis';
import { User } from '~/shared/types';
import { z } from 'zod';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

const PATH_TO_KEY_FILE = process.env.GOOGLE_SERVICE_ACCOUNT_JSON_FILE;

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

const jwtInputSchema = z.object({
  type: z.string(),
  client_email: z.string().email(),
  private_key: z.string(),
  private_key_id: z.string(),
  project_id: z.string(),
  client_id: z.string(),
  client_secret: z.string(),
  refresh_token: z.string(),
  quota_project_id: z.string(),
  universe_domain: z.string(),
});

export async function sendFeedbackToGoogleSheets({
  feedbackText,
  userDetails,
}: {
  feedbackText: string;
  userDetails: User;
}) {
  try {
    const credentialsEnvParse = process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS
      ? jwtInputSchema.safeParse(
          JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS),
        )
      : null;

    if (credentialsEnvParse?.success === false) {
      console.error(
        'Environment variable: GOOGLE_SERVICE_ACCOUNT_CREDENTIALS is invalid!',
      );
    }

    const credentialsOrKeyFile =
      credentialsEnvParse && credentialsEnvParse.success
        ? {
            credentials: credentialsEnvParse.data,
          }
        : { keyFile: PATH_TO_KEY_FILE };

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
