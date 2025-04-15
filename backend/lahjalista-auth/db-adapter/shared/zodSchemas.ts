import { z } from 'zod';

const databaseSessionSchema = z.object({
  uuid: z.string().uuid(),
  expiresAt: z.date(),
  userUUID: z.string().uuid(),
});

const createSessionSchema = databaseSessionSchema;

const sessionSchema = databaseSessionSchema.extend({
  fresh: z.boolean(),
});

// this will be changed when imported to Lahjalista project
const lahjaListaUserSchema = z.object({
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  uuid: z.string(),
  role: z.string(),
});

const validSessionResultSchema = z.object({
  status: z.literal('valid'),
  databaseSession: databaseSessionSchema,
  databaseUser: lahjaListaUserSchema,
});

const invalidSessionResultSchema = z.object({
  status: z.literal('invalid'),
  databaseSession: databaseSessionSchema,
  databaseUser: lahjaListaUserSchema,
});
