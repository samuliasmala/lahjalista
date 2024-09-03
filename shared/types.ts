import { z } from 'zod';
import {
  createFeedbackSchema,
  createGiftSchema,
  createSessionSchema,
  createUserSchema,
  feedbackSchema,
  getUserSchema,
  giftSchema,
  userLoginDetailsSchema,
} from './zodSchemas';

export type {
  Gift as PrismaGift,
  User as PrismaUser,
  Session as PrismaSession,
} from '@prisma/client';

// GIFT
export type Gift = z.infer<typeof giftSchema>;

export type CreateGift = z.infer<typeof createGiftSchema>;

// USER
export type User = z.infer<typeof getUserSchema>;

export type CreateUser = z.infer<typeof createUserSchema>;

export type UserLoginDetails = z.infer<typeof userLoginDetailsSchema>;

// SESSION
export type CreateSession = z.infer<typeof createSessionSchema>;

// FEEDBACK
export type Feedback = z.infer<typeof feedbackSchema>;

export type CreateFeedback = z.infer<typeof createFeedbackSchema>;
