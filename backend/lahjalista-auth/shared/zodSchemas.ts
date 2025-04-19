import { z } from 'zod';
import { getUserSchema } from '~/shared/zodSchemas';

const sessionSchema = z.object({
  uuid: z.string().uuid(),
  userUUID: z.string().uuid(),
  expiresAt: z.date(),
  isLoggedIn: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const databaseSessionSchema = sessionSchema;

const createSessionSchema = sessionSchema;

const frontendSessionSchema = databaseSessionSchema
  .pick({ uuid: true, expiresAt: true, isLoggedIn: true })
  .extend({ fresh: z.boolean() });

const validSessionResultSchema = z.object({
  status: z.literal('valid'),
  databaseSession: databaseSessionSchema,
  databaseUser: getUserSchema,
});

const invalidSessionResultSchema = z.object({
  status: z.literal('invalid'),
  databaseSession: databaseSessionSchema,
  databaseUser: getUserSchema,
});
