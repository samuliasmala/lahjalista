export interface Session extends DatabaseSession {
  fresh: boolean;
}

export type DatabaseSession = {
  uuid: string;
  expiresAt: Date;
  userUUID: string;
};

export type CreateSession = {
  uuid: string;
  expiresAt: Date;
  userUUID: string;
};

export type User = {
  uuid: string; // userUUID
};

export type DatabaseAdapter = {
  createSession: (
    sessionData: CreateSession,
  ) => Promise<DatabaseSession | null>;
  deleteSession: (sessionUUID: string) => Promise<void>;
  //setSession: () => Promise<void>; // createSession is same
  getSession: (sessionUUID: string) => Promise<DatabaseSession | null>;
  //prettier-ignore
  getUserFromSession: (sessionUUID: string) => Promise<LahjalistaUser | null>; // potentially a dangerous function
  // prettier-ignore
  getUserAndSessions: (userUUID: string) => Promise<[DatabaseSession[], LahjalistaUser] | null>; // gets the user and ALL the sessions
  //prettier-ignore
  getUserAndSession: (sessionUUID: string) => Promise<GetUserAndSessionResult>; // gets the user and ONLY ONE session
  getUserSessions: (userUUID: string) => Promise<DatabaseSession[]>; // gets all the sessions belonging to a ONE user
  // prettier-ignore
  updateSessionExpirationDate: (sessionUUID: string, newSessionExpirationDate: Date) => Promise<void>;
  deleteUserSessions: (userUUID: string) => Promise<void>; // deletes all the sessions belonging to a user
  deleteExpiredSessions: () => Promise<void>;
};

// hardcoded values of Lahjalista's User which can be shown to user
// For example, id field is not added here, it'd leak a number of users due to auto-increment
export type LahjalistaUser = {
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
  uuid: string;
  role: string;
};

type ValidSessionResult = {
  status: 'valid';
  databaseSession: DatabaseSession;
  databaseUser: LahjalistaUser;
};

type InvalidSessionResult = {
  status: 'invalid';
  databaseSession: null;
  databaseUser: null;
};

export type GetUserAndSessionResult = ValidSessionResult | InvalidSessionResult;
