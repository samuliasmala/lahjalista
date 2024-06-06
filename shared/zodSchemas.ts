import { z } from 'zod';
import { emailRegex, passwordRegex } from './regexPatterns';
import { Prisma } from '@prisma/client';

export const giftSchema = z.object({
  gift: z.string().min(1),
  receiver: z.string().min(1),
  createdAt: z.date(),
  updatedAt: z.date(),
  uuid: z.string(),
});

export const createGiftSchema = z.object({
  gift: z.string().min(1),
  receiver: z.string().min(1),
});

export const userSchema = z.object({
  createdAt: z.date(),
  updatedAt: z.date(),
  uuid: z.string(),
  email: z.string().min(1).max(128).regex(emailRegex),
  firstName: z.string().min(1).max(128),
  lastName: z.string().min(1).max(128),
});

export const createUserSchema = z.object({
  email: z.string().min(1).max(128).regex(emailRegex),
  firstName: z.string().min(1).max(128),
  lastName: z.string().min(1).max(128),
  password: z.string().min(1).max(128).regex(passwordRegex),
  Session: z.custom<Prisma.SessionCreateNestedOneWithoutUserInput>().optional(),
});

export const userLoginDetailsSchema = z.object({
  email: z.string().min(1).max(100).regex(emailRegex),
  password: z.string().min(1).max(100).regex(passwordRegex),
  rememberMe: z.boolean(),
});

export const createSessionSchema = z.object({
  user: z.custom<Prisma.UserCreateNestedOneWithoutSessionInput>(),
});

export const feedbackSchema = z.object({
  uuid: z.string(),
  feedbackText: z.string().min(1, 'Feedback text is mandatory!'),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createFeedbackSchema = feedbackSchema.pick({ feedbackText: true });
