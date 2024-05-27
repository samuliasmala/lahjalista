import { z } from 'zod';
import {
  createGiftSchema,
  createSessionSchema,
  createUserSchema,
  getUserSchema,
  giftSchema,
  userLoginDetailsSchema,
} from './zodSchemas';

export type {
  Gift as PrismaGift,
  User as PrismaUser,
  Session as PrismaSession,
} from '@prisma/client';

export type Gift = z.infer<typeof giftSchema>;
export type CreateGift = z.infer<typeof createGiftSchema>;

// CHECK THIS
export type User = z.infer<typeof getUserSchema>;
export type CreateUser = z.infer<typeof createUserSchema>;

export type UserLoginDetails = z.infer<typeof userLoginDetailsSchema>;

export type CreateSession = z.infer<typeof createSessionSchema>;
