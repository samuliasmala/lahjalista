import { PrismaClient } from '@prisma/client';
import {
  CreateSession,
  DatabaseAdapter,
  Session,
  GetUserAndSessionResult,
} from '~/shared/types';
import { User } from '~/shared/types';
import { sessionSchema } from '~/shared/zodSchemas';

declare global {
  var prisma: undefined | PrismaClient; //eslint-disable-line no-var
}

export class LahjalistaAuthAdapter implements DatabaseAdapter {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient | undefined) {
    this.prisma = prisma ?? new PrismaClient();
  }

  private async _getUser(userUUID: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { uuid: userUUID },
    });

    return user ? user : null;
  }

  async createSession(sessionData: CreateSession): Promise<Session | null> {
    const { expiresAt, userUUID, uuid } = sessionData;
    // perhaps isLoggedIn: true here?
    const session = await this.prisma.session.create({
      data: { uuid, userUUID, expiresAt },
    });

    return session;
  }

  async deleteSession(sessionUUID: string): Promise<void> {
    await this.prisma.session.delete({ where: { uuid: sessionUUID } });
    return;
  }

  async getSession(sessionUUID: string): Promise<Session | null> {
    const session = await this.prisma.session.findUnique({
      where: { uuid: sessionUUID },
    });

    return session;
  }

  /** **Potentially a risky function** */
  async getUserFromSession(sessionUUID: string): Promise<User | null> {
    const session = await this.prisma.session.findUnique({
      where: { uuid: sessionUUID },
      select: { User: { omit: { id: true, password: true } } },
    });

    if (!session || !session.User) return null;

    return session.User;
  }

  async getUserAndSessions(
    userUUID: string,
  ): Promise<[Session[], User] | null> {
    const sessions = await this.prisma.session.findMany({
      where: { userUUID: userUUID },
    });

    // return null if sessions were not found
    if (sessions.length <= 0) return null;

    // if sessions were found get the user
    const user = await this._getUser(userUUID);

    // if user does not exist return null
    if (!user) return null;

    return [sessions, user];
  }

  /** **Returns the owner user of the session and the session itself** */
  async getUserAndSession(
    sessionUUID: string,
  ): Promise<GetUserAndSessionResult> {
    const sessionFromDatabase = await this.prisma.session.findUnique({
      where: { uuid: sessionUUID },
      select: {
        uuid: true,
        createdAt: true,
        isLoggedIn: true,
        updatedAt: true,
        expiresAt: true,
        userUUID: true,
        User: { omit: { id: true, password: true } },
      },
    });

    if (!sessionFromDatabase || !sessionFromDatabase.User)
      return { status: 'invalid', databaseSession: null, databaseUser: null };

    const databaseSession = sessionSchema.safeParse(sessionFromDatabase);

    // if Zod parsing fails for some reason, return invalid
    if (!databaseSession.success)
      return { status: 'invalid', databaseSession: null, databaseUser: null };

    return {
      status: 'valid',
      databaseSession: databaseSession.data,
      databaseUser: sessionFromDatabase.User,
    };
  }

  async getUserSessions(userUUID: string): Promise<Session[]> {
    const sessions = await this.prisma.session.findMany({
      where: { userUUID },
    });

    return sessions;
  }

  /** **Deletes sessions that belongs to a specific user** */
  async deleteUserSessions(userUUID: string): Promise<void> {
    await this.prisma.session.deleteMany({ where: { userUUID } });

    return;
  }

  /** **Deletes ALL the expired sessions no matter who owns it** */
  async deleteExpiredSessions(): Promise<void> {
    await this.prisma.session.deleteMany({
      where: { expiresAt: { lte: new Date() } },
    });

    return;
  }

  /** **Updates a specific given session** */
  async updateSessionExpirationDate(
    sessionUUID: string,
    newSessionExpirationDate: Date,
  ): Promise<void> {
    await this.prisma.session.update({
      where: { uuid: sessionUUID },
      data: { expiresAt: newSessionExpirationDate },
    });

    return;
  }
}
