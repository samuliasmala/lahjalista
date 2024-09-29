import { GoogleAuth } from 'google-auth-library';
import { GoogleApiAuthentication_type, GoogleApiSheets_type } from './types';
import { JSONClient } from 'google-auth-library/build/src/auth/googleauth';
import { google, sheets_v4 } from 'googleapis';

export class GoogleApiAuthentication implements GoogleApiAuthentication_type {
  pathToKeyFile?: string | undefined;
  scopes?: string[];
  auth?: GoogleAuth<JSONClient>;

  async authenticate({
    pathToKeyFile,
    scopes,
  }: {
    pathToKeyFile?: string;
    scopes?: string[];
  }) {
    this.pathToKeyFile = pathToKeyFile;
    this.scopes = scopes;

    this.auth = new google.auth.GoogleAuth({
      keyFile: pathToKeyFile,
      scopes: scopes,
    });

    return this;
  }
}

export class GoogleApiSheets
  extends GoogleApiAuthentication
  implements GoogleApiSheets_type
{
  sheetsVersion?: 'v4' | undefined;
  spreadsheetId?: string | undefined;
  sheets?: sheets_v4.Sheets | undefined;
  sheetName?: string | undefined;
  feedback?: string;
  userUUID?: string;
  date?: string;

  constructor(props?: {
    sheetVersion?: 'v4';
    auth?: GoogleAuth<JSONClient>;
    spreadsheetId?: string;
    sheetName?: string;
  }) {
    super();
    this.auth = props?.auth;
    this.spreadsheetId = props?.spreadsheetId;
    this.sheetName = props?.sheetName;

    this.sheets = google.sheets({
      version: 'v4',
      auth: props?.auth,
    });
  }

  initialize(props: {
    sheetsVersion: 'v4';
    auth?: GoogleAuth<JSONClient>;
    spreadsheetId?: string;
    sheetName?: string;
  }) {
    this.auth = props.auth;
    this.spreadsheetId = props.spreadsheetId;
    this.sheetName = props.sheetName;

    this.sheets = google.sheets({
      version: props.sheetsVersion,
      auth: props.auth,
    });

    return this;
  }

  async findSpecificRows(
    props: {
      fromColumn: string;
      fromRow: number | 'all';
      toColumn: string;
      toRow: number | 'all';
    } & GoogleApiSheets_type,
  ) {
    this._isSheetsInitialized();

    const response = await this.sheets?.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: `Palautteet!A:C`,
    });

    console.log(response?.data.values);
    return this;
  }

  async appendData(props: {
    feedback?: string;
    userUUID?: string;
    date?: string;
  }) {
    this.feedback = props.feedback;
    this.userUUID = props.userUUID;
    this.date = props.date;

    this._isSheetsInitialized();
    this._isSheetsRequestBodyGiven();

    await this.sheets?.spreadsheets.values.append({
      auth: this.auth,
      spreadsheetId: this.spreadsheetId,
      range: 'Palautteet!A1:C1',
      requestBody: {
        majorDimension: 'ROWS',
        values: [[props.feedback, props.userUUID, props.date]],
      },
      valueInputOption: 'USER_ENTERED',
    });
  }

  _isSheetsInitialized() {
    if (!this.sheets || !this.sheets.context._options.auth)
      throw new Error(
        'GoogleApiSheets instance must be initialized before calling Google API',
      );
  }

  _isSheetsRequestBodyGiven() {
    if (!this.feedback || !this.userUUID || !this.date) {
      throw new Error('Request body was not valid!');
    }
  }
}
