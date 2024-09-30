import { GoogleAuth } from 'google-auth-library';
import { JSONClient } from 'google-auth-library/build/src/auth/googleauth';
import { google, sheets_v4 } from 'googleapis';

export class GoogleApiAuthentication {
  pathToKeyFile?: string;
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

export class GoogleApiSheets extends GoogleApiAuthentication {
  sheetsVersion?: 'v4';
  spreadsheetId?: string;
  sheets?: sheets_v4.Sheets;
  sheetName?: string;
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

  async findSpecificRows(props: {
    fromColumn: string;
    fromRow: number | 'all';
    toColumn: string;
    toRow: number | 'all';
  }) {
    this._isSheetsInitialized();

    const response = await this.sheets?.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: `${this.sheetName}!${props.fromColumn}${props.fromRow === 'all' ? 9999999 : props.fromRow}:${props.toColumn}${props.toRow === 'all' ? 999999 : props.toRow}`,
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
      range: `${this.sheetName}!A:C`,
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
