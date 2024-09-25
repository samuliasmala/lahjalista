import { GoogleAuth } from 'google-auth-library';
import { GoogleApiAuthentication_type, GoogleApiSheets_type } from './types';
import { JSONClient } from 'google-auth-library/build/src/auth/googleauth';
import { google } from 'googleapis';

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
    const auth = new google.auth.GoogleAuth({
      keyFile: pathToKeyFile,
      scopes: scopes,
    });
    //console.log('\n\n\n\n', await auth.getClient(), '\n\n\n\n\n');
    this.auth = auth;
    return this;
  }
}

export class GoogleApiSheets
  extends GoogleApiAuthentication
  implements GoogleApiSheets_type
{
  sheetsVersion?: string | undefined;
  spreadsheetId?: string | undefined;

  initialize({
    sheetsVersion,
    auth,
    spreadsheetId,
  }: {
    sheetsVersion?: 'v4';
    auth?: GoogleAuth<JSONClient>;
    spreadsheetId?: string;
  }) {
    this.sheetsVersion = sheetsVersion;
    this.auth = auth;
    this.spreadsheetId = spreadsheetId;
    return this;
  }

  findSpecificRows(
    props: {
      fromColumn: string;
      fromRow: number | 'all';
      toColumn: string;
      toRow: number | 'all';
    } & GoogleApiSheets_type,
  ) {
    console.log(this.spreadsheetId);
    console.log(
      'this.spreadsheetId:',
      this.spreadsheetId,
      '\n\nprops.spreadsheetId:',
      props.spreadsheetId,
    );
    this.spreadsheetId = props.spreadsheetId ?? this.spreadsheetId;
    console.log(this.spreadsheetId);
    /*
    console.log(
      fromColumn,
      fromRow,
      toColumn,
      toRow,
      this.pathToKeyFile,
      this.auth,
      this.spreadsheetId,
    );
    */
    return this;
  }
}
