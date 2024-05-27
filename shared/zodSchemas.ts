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

export const updateGiftSchema = createGiftSchema;

export const userSchema = z.object({
  email: z.string().min(1).max(128).regex(emailRegex).toLowerCase(),
  firstName: z.string().min(1).max(128),
  lastName: z.string().min(1).max(128),
});

export const getUserSchema = userSchema.extend({
  createdAt: z.date(),
  updatedAt: z.date(),
  uuid: z.string(),
});

export const createUserSchema = userSchema.extend({
  password: z.string().min(1).max(128).regex(passwordRegex),
});

export const updateUserSchema = userSchema;

// CHECK THIS
export const userLoginDetailsSchema = userSchema
  .pick({ email: true })
  .merge(createUserSchema.pick({ password: true }))
  .extend({ rememberMe: z.boolean() });

/*
  export const userLoginDetailsSchema = z.object({
  email: z.string().min(1).max(128).regex(emailRegex),
  password: z.string().min(1).max(128).regex(passwordRegex),
  rememberMe: z.boolean(),
});
*/

export const createSessionSchema = z.object({
  createdAt: z.date(),
  updatedAt: z.date(),
  user: z.custom<Prisma.UserCreateNestedOneWithoutSessionInput>(),
});
