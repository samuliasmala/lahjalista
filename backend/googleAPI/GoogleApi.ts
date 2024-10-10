import { GoogleAuth } from 'google-auth-library';
import { JSONClient } from 'google-auth-library/build/src/auth/googleauth';
import { google, sheets_v4 } from 'googleapis';

export class GoogleApiAuthentication {
  // added default values to these two. Exclamation mark would be another one
  // throwing same error because GoogleApiAuthentication does not have a constructor
  pathToKeyFile: string = '';
  scopes: string[] = [];
  // auth can have exclamation mark due to we have a check for it
  auth!: GoogleAuth<JSONClient>;

  authenticate({
    pathToKeyFile,
    scopes,
  }: {
    pathToKeyFile: string;
    scopes: string[];
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
  // exclamation marks added so can bypass following error for now:
  // property 'spreadsheetId' has no initializer and is not definitely assigned in the constructor.
  sheetsVersion!: 'v4';
  spreadsheetId!: string;
  sheets!: sheets_v4.Sheets;
  sheetName!: string;

  // left the constructor here still, if this is better way to do than initialize-method
  /*
  // constructor and initialize method should be exactly same thing
  constructor(props?: {
    sheetVersion: 'v4';
    auth: GoogleAuth<JSONClient>;
    spreadsheetId: string;
    sheetName: string;
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
*/

  initialize(props: {
    sheetsVersion: 'v4';
    auth: GoogleAuth<JSONClient>;
    spreadsheetId: string;
    sheetName: string;
  }) {
    this._isAuthenticated();

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
    this._isAuthenticated();

    const response = await this.sheets?.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: `${this.sheetName}!${props.fromColumn}${props.fromRow === 'all' ? 9999999 : props.fromRow}:${props.toColumn}${props.toRow === 'all' ? 999999 : props.toRow}`,
    });

    console.log(response?.data.values);
    return this;
  }

  async appendData(props: {
    feedback: string;
    userUUID: string;
    date: string;
  }) {
    this._isSheetsInitialized();
    this._isAuthenticated();

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

  _isAuthenticated() {
    if (!this.auth)
      throw new Error(
        'You have to be authenticated before using Google API. Use GoogleApiAuthentication.authenticate to do that',
      );
  }
}
