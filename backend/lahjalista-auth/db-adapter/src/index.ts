import { PrismaClient } from '@prisma/client';
import {
  CreateSession,
  DatabaseAdapter,
  DatabaseSession,
  GetUserAndSessionResult,
  LahjalistaUser,
} from '~/backend/lahjalista-auth/shared/types';
import { User } from '~/shared/types';

declare global {
  var prisma: undefined | PrismaClient; //eslint-disable-line no-var
}

export class LahjalistaAuthAdapter implements DatabaseAdapter {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient | undefined) {
    this.prisma = prisma ?? new PrismaClient();
  }

  private async _getUser(userUUID: string): Promise<LahjalistaUser | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        uuid: userUUID,
      },
    });

    return user ? user : null;
  }

  async createSession(
    sessionData: CreateSession,
  ): Promise<DatabaseSession | null> {
    const { expiresAt, userUUID, uuid } = sessionData;
    const session = await this.prisma.session.create({
      data: {
        uuid,
        userUUID,
        expiresAt,
      },
      select: {
        uuid: true,
        expiresAt: true,
        userUUID: true,
      },
    });

    return session;
  }

  async deleteSession(sessionUUID: string): Promise<void> {
    await this.prisma.session.delete({
      where: {
        uuid: sessionUUID,
      },
    });
    return;
  }

  async getSession(sessionUUID: string): Promise<DatabaseSession | null> {
    const session = await this.prisma.session.findUnique({
      where: { uuid: sessionUUID },
      select: {
        uuid: true,
        expiresAt: true,
        userUUID: true,
      },
    });

    return session;
  }

  /** **Potentially a risky function** */
  async getUserFromSession(sessionUUID: string): Promise<User | null> {
    const session = await this.prisma.session.findUnique({
      where: {
        uuid: sessionUUID,
      },
      select: {
        User: {
          omit: {
            id: true,
            password: true,
          },
        },
      },
    });

    if (!session || !session.User) return null;

    return session.User;
  }

  async getUserAndSessions(
    userUUID: string,
  ): Promise<[DatabaseSession[], User] | null> {
    const sessions = await this.prisma.session.findMany({
      where: {
        userUUID: userUUID,
      },
      select: {
        uuid: true,
        expiresAt: true,
        userUUID: true,
      },
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
      where: {
        uuid: sessionUUID,
      },
      select: {
        uuid: true,
        expiresAt: true,
        userUUID: true,
        User: {
          omit: {
            id: true,
            password: true,
          },
        },
      },
    });

    if (!sessionFromDatabase || !sessionFromDatabase.User)
      return { status: 'invalid', databaseSession: null, databaseUser: null };

    const { expiresAt, userUUID, uuid } = sessionFromDatabase;

    // add Zod here perhaps
    return {
      status: 'valid',
      databaseSession: { expiresAt, userUUID, uuid },
      databaseUser: sessionFromDatabase.User,
    };
  }

  async getUserSessions(userUUID: string): Promise<DatabaseSession[]> {
    const sessions = await this.prisma.session.findMany({
      where: {
        userUUID,
      },
      select: {
        uuid: true,
        expiresAt: true,
        userUUID: true,
      },
    });

    return sessions;
  }

  /** **Deletes sessions that belongs to a specific user** */
  async deleteUserSessions(userUUID: string): Promise<void> {
    await this.prisma.session.deleteMany({
      where: {
        userUUID,
      },
    });

    return;
  }

  /** **Deletes ALL the expired sessions no matter who owns it** */
  async deleteExpiredSessions(): Promise<void> {
    await this.prisma.session.deleteMany({
      where: {
        expiresAt: {
          lte: new Date(),
        },
      },
    });

    return;
  }

  /** **Updates a specific given session** */
  async updateSessionExpirationDate(
    sessionUUID: string,
    newSessionExpirationDate: Date,
  ): Promise<void> {
    await this.prisma.session.update({
      where: {
        uuid: sessionUUID,
      },
      data: {
        expiresAt: newSessionExpirationDate,
      },
    });

    return;
  }
}

const prisma = new PrismaClient();
