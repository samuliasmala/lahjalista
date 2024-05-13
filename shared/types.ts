import { z } from 'zod';
import {
  createGiftSchema,
  createSessionSchema,
  createUserSchema,
  giftSchema,
  userLoginDetailsSchema,
  userSchema,
} from './zodSchemas';
import { Prisma } from '@prisma/client';

export type Gift = z.infer<typeof giftSchema>;
export type CreateGift = z.infer<typeof createGiftSchema>;

export type User = z.infer<typeof userSchema>;
export type CreateUser = z.infer<typeof createUserSchema>;

export type UserLoginDetails = z.infer<typeof userLoginDetailsSchema>;

//export type CreateSession = z.infer<typeof createSessionSchema>;
export type CreateSession = Omit<
  Prisma.SessionCreateInput,
  'id' | 'expiresAt' | 'userId'
> & {
  user: Prisma.UserCreateNestedOneWithoutSessionInput;
};

export type {
  Gift as PrismaGift,
  User as PrismaUser,
  Session as PrismaSession,
} from '@prisma/client';
