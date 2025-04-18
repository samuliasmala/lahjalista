import { TimeSpan, createDate, isWithinExpirationDate } from './date';
import { CookieController } from './cookie';
import { generateUUID } from './crypto';

import type { Cookie, CookieAttributes } from './cookie';

import type {
  Session,
  LahjalistaUser,
  DatabaseAdapter,
} from '~/packages/shared/types';

export class LahjaListaAuth {
  private adapter: DatabaseAdapter;
  private sessionExpiresIn: TimeSpan;
  private sessionCookieController: CookieController;

  public readonly sessionCookieName: string;

  constructor(
    adapter: DatabaseAdapter,
    options?: {
      sessionExpiresIn?: TimeSpan;
      sessionCookie?: SessionCookieOptions;
    },
  ) {
    this.adapter = adapter;

    this.sessionExpiresIn = options?.sessionExpiresIn ?? new TimeSpan(30, 'd');

    // changed default sessionCookie name from "auth_session" -> "lahjalista_auth_session"
    this.sessionCookieName =
      options?.sessionCookie?.name ?? 'lahjalista_auth_session';

    let sessionCookieExpiresIn = this.sessionExpiresIn;
    if (options?.sessionCookie?.expires === false) {
      sessionCookieExpiresIn = new TimeSpan(400, 'd');
    }
    const baseSessionCookieAttributes: CookieAttributes = {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      ...options?.sessionCookie?.attributes,
    };
    this.sessionCookieController = new CookieController(
      this.sessionCookieName,
      baseSessionCookieAttributes,
      {
        expiresIn: sessionCookieExpiresIn,
      },
    );
  }

  /** **Gets all the NON-EXPIRED sessions of a user** */
  public async getUserSessions(userUUID: string): Promise<Session[]> {
    const databaseSessions = await this.adapter.getUserSessions(userUUID);
    const sessions: Session[] = [];
    for (const databaseSession of databaseSessions) {
      // session is expired, don't add it into sessions array
      if (!isWithinExpirationDate(databaseSession.expiresAt)) {
        continue;
      }

      sessions.push({
        uuid: databaseSession.uuid,
        expiresAt: databaseSession.expiresAt,
        userUUID: databaseSession.userUUID,
        fresh: false,
      });
    }
    return sessions;
  }

  /** **Checks if session is valid and can let user in** */
  public async validateSession(
    sessionUUID: string,
  ): Promise<
    { user: LahjalistaUser; session: Session } | { user: null; session: null }
  > {
    const {
      status: databaseStatus,
      databaseSession,
      databaseUser,
    } = await this.adapter.getUserAndSession(sessionUUID);

    // if status is invalid, return object with null values
    if (databaseStatus === 'invalid') {
      return { session: null, user: null };
    }

    // if session has expirated run this
    if (!isWithinExpirationDate(databaseSession.expiresAt)) {
      await this.adapter.deleteSession(databaseSession.uuid);
      return { session: null, user: null };
    }

    // Reduces current expiration time of session the half of the incoming sessionExpirationTime
    // for example, the default time is 30 days. So 30 days = 30 * 1000 * 60 * 60 * 24 = 2 592 000 000
    // databaseSession.expiresAt could be for exmaple this day + 10 days. So 10 days = 10 * 1000 * 60 * 60 * 24 = 864 000 000
    // 864 000 000 - 2 592 000 000 / 2
    // 864 000 000 - 1 296 000 000 = −432 000 000

    // activePeriodExpirationDate seems to be true if databaseSession.expiresAt is something like 50 000 days
    // else it seems to be false
    // not totally sure about the primary usage
    const activePeriodExpirationDate = new Date(
      databaseSession.expiresAt.getTime() -
        this.sessionExpiresIn.milliseconds() / 2,
    );
    const session: Session = {
      uuid: databaseSession.uuid,
      userUUID: databaseSession.userUUID,
      fresh: false,
      expiresAt: databaseSession.expiresAt,
    };

    // here we would check if current time is less than so called "activePeriodExpirationDate" time
    // so 1 744 363 890 715 < (-432 000 000)
    // output: false
    if (!isWithinExpirationDate(activePeriodExpirationDate)) {
      session.fresh = true;
      session.expiresAt = createDate(this.sessionExpiresIn);
      await this.adapter.updateSessionExpirationDate(
        databaseSession.uuid,
        session.expiresAt,
      );
    }
    const user: LahjalistaUser = databaseUser;
    return { user, session };
  }

  /** **Creates a new session to the database which can be "given" to the user** */
  public async createSession(
    userUUID: string,
    options?: {
      sessionUUID?: string;
    },
  ): Promise<Session> {
    const sessionUUID = options?.sessionUUID ?? generateUUID();
    const sessionExpiresAt = createDate(this.sessionExpiresIn);
    await this.adapter.createSession({
      uuid: sessionUUID,
      expiresAt: sessionExpiresAt,
      userUUID,
    });
    const session: Session = {
      userUUID,
      uuid: sessionUUID,
      fresh: true,
      expiresAt: sessionExpiresAt,
    };
    return session;
  }

  /** **Deletes ONLY ONE session of a user** */
  public async deleteSession(sessionUUID: string): Promise<void> {
    await this.adapter.deleteSession(sessionUUID);
  }

  /** **Deletes ALL the sessions of a user** */
  public async deleteUserSessions(userUUID: string): Promise<void> {
    await this.adapter.deleteUserSessions(userUUID);
  }

  /** **Deletes ALL the expired sessions of ALL the users** */
  public async deleteExpiredSessions(): Promise<void> {
    await this.adapter.deleteExpiredSessions();
  }

  public readSessionCookie(cookieHeader: string): string | null {
    const sessionUUID = this.sessionCookieController.parse(cookieHeader);
    return sessionUUID;
  }

  // this seems to be unused in Lahjalista. Let's keep it for now
  public readBearerToken(authorizationHeader: string): string | null {
    const [authScheme, token] = authorizationHeader.split(' ') as [
      string,
      string | undefined,
    ];
    if (authScheme !== 'Bearer') {
      return null;
    }
    return token ?? null;
  }

  public createSessionCookie(sessionUUID: string): Cookie {
    return this.sessionCookieController.createCookie(sessionUUID);
  }

  public createBlankSessionCookie(): Cookie {
    return this.sessionCookieController.createBlankCookie();
  }
}

export interface SessionCookieOptions {
  name?: string;
  expires?: boolean;
  attributes?: SessionCookieAttributesOptions;
}

export interface SessionCookieAttributesOptions {
  sameSite?: 'lax' | 'strict' | 'none';
  domain?: string;
  path?: string;
  secure?: boolean;
}
