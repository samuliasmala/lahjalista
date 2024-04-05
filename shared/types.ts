import { Prisma, Gift as PrismaGift, User as PrismaUser } from '@prisma/client';

export type Gift = Omit<PrismaGift, 'id' | 'userUUID'>;
export type CreateGift = Omit<
  Prisma.GiftCreateInput,
  'uuid' | 'createdAt' | 'updatedAt' | 'user'
>;

export type User = Omit<PrismaUser, 'id' | 'password'>;
export type CreateUser = Omit<
  Prisma.UserCreateInput,
  'uuid' | 'createdAt' | 'updatedAt' | 'gift'
>;

export type CreateSession = Omit<
  Prisma.SessionCreateInput,
  'id' | 'expiresAt' | 'userId'
> & {
  user: Prisma.UserCreateNestedOneWithoutSessionInput;
};
