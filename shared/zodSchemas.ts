import { z } from 'zod';
import { emailRegex, passwordRegex } from './regexPatterns';
import { Prisma } from '@prisma/client';

export const ZodGift = z.object({
  gift: z.string().min(1),
  receiver: z.string().min(1),
  createdAt: z.date(),
  updatedAt: z.date(),
  uuid: z.string(),
});

export const ZodCreateGift = z.object({
  gift: z.string().min(1),
  receiver: z.string().min(1),
});

export const ZodUser = z.object({
  createdAt: z.date(),
  updatedAt: z.date(),
  uuid: z.string(),
  email: z.string().regex(emailRegex),
  firstName: z.string().min(1).max(128),
  lastName: z.string().min(1).max(128),
});

export const ZodCreateUser = z.object({
  email: z.string().regex(emailRegex),
  firstName: z.string().min(1).max(128),
  lastName: z.string().min(1).max(128),
  password: z.string().regex(passwordRegex),
  Session: z.custom<Prisma.SessionCreateNestedOneWithoutUserInput>().optional(),
});

export const ZodUserLoginDetails = z.object({
  email: z.string().regex(emailRegex),
  password: z.string().regex(passwordRegex),
  rememberMe: z.boolean(),
});

export const ZodCreateSession = z.object({
  user: z.custom<Prisma.UserCreateNestedOneWithoutSessionInput>(),
});
