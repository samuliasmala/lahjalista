import { z } from 'zod';
import {
  createFeedbackSchema,
  createGiftSchema,
  createSessionSchema,
  createUserSchema,
  feedbackSchema,
  giftSchema,
  userLoginDetailsSchema,
  userSchema,
} from './zodSchemas';

export type {
  Gift as PrismaGift,
  User as PrismaUser,
  Session as PrismaSession,
} from '@prisma/client';

export type Gift = z.infer<typeof giftSchema>;
export type CreateGift = z.infer<typeof createGiftSchema>;

export type User = z.infer<typeof userSchema>;
export type CreateUser = z.infer<typeof createUserSchema>;

export type UserLoginDetails = z.infer<typeof userLoginDetailsSchema>;

export type CreateSession = z.infer<typeof createSessionSchema>;

export type Feedback = z.infer<typeof feedbackSchema>;
export type CreateFeedback = z.infer<typeof createFeedbackSchema>;
