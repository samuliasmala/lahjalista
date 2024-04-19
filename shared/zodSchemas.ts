import { z } from 'zod';
import { User, CreateUser } from './types';
import { emailRegex, passwordRegex } from './regexPatterns';
import { Prisma } from '@prisma/client';

export const ZodGift = z.object({
  gift: z.string().min(1),
  receiver: z.string().min(1),
  createdAt: z.date(),
  updatedAt: z.date(),
  uuid: z.string(),
});

type ZodGift = z.infer<typeof ZodGift>;

export const ZodCreateGift = z.object({
  gift: z.string().min(1),
  receiver: z.string().min(1),
});

type ZodCreateGift = z.infer<typeof ZodCreateGift>;

export const ZodUser = z.object({
  createdAt: z.date(),
  updatedAt: z.date(),
  uuid: z.string(),
  email: z.string().regex(emailRegex),
  firstName: z.string().min(1).max(128),
  lastName: z.string().min(1).max(128),
});

type ZodUser = z.infer<typeof ZodUser>;

export const ZodCreateUser = z.object({
  email: z.string().regex(emailRegex),
  firstName: z.string().min(1).max(128),
  lastName: z.string().min(1).max(128),
  password: z.string().regex(passwordRegex),
  Session: z.custom<Prisma.SessionCreateNestedOneWithoutUserInput>().optional(),
});

type ZodCreateUser = z.infer<typeof ZodCreateUser>;

export const ZodUserLoginDetails = z.object({
  email: z.string().regex(emailRegex),
  password: z.string().regex(passwordRegex),
  rememberMe: z.boolean(),
});

type ZodUserLoginDetails = z.infer<typeof ZodUserLoginDetails>;

export const ZodCreateSession = z.object({
  user: z.custom<Prisma.UserCreateNestedOneWithoutSessionInput>(),
});

type ZodCreateSession = z.infer<typeof ZodCreateSession>;
