import { GoogleAuth } from 'google-auth-library';
import { JSONClient } from 'google-auth-library/build/src/auth/googleauth';
import { sheets_v4 } from 'googleapis';

export interface GoogleApiAuthentication_type {
  pathToKeyFile?: string;
  scopes?: string[];
  auth?: GoogleAuth<JSONClient>;
}

export interface GoogleApiSheets_type extends GoogleApiAuthentication_type {
  sheetsVersion?: string;
  spreadsheetId?: string;
  sheetName?: string;
  sheets?: sheets_v4.Sheets;
}
