import { Prisma, Gift as PrismaGift, User as PrismaUser } from '@prisma/client';

export type {
  Gift as PrismaGift,
  User as PrismaUser,
  Session as PrismaSession,
} from '@prisma/client';

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

export type UserLoginDetails = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export type CreateSession = Omit<
  Prisma.SessionCreateInput,
  'id' | 'expiresAt' | 'userId'
> & {
  user: Prisma.UserCreateNestedOneWithoutSessionInput;
};
