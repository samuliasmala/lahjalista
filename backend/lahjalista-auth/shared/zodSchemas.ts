import { z } from 'zod';
import { getUserSchema } from '~/shared/zodSchemas';

export const sessionSchema = z.object({
  uuid: z.string().uuid(),
  userUUID: z.string().uuid(),
  expiresAt: z.date(),
  isLoggedIn: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const databaseSessionSchema = sessionSchema;

export const createSessionSchema = sessionSchema;

export const frontendSessionSchema = databaseSessionSchema
  .pick({ uuid: true, expiresAt: true, isLoggedIn: true })
  .extend({ fresh: z.boolean() });

export const validSessionResultSchema = z.object({
  status: z.literal('valid'),
  databaseSession: databaseSessionSchema,
  databaseUser: getUserSchema,
});

export const invalidSessionResultSchema = z.object({
  status: z.literal('invalid'),
  databaseSession: databaseSessionSchema,
  databaseUser: getUserSchema,
});
