import { z } from 'zod';
import {
  createGiftSchema,
  createSessionSchema,
  createUserSchema,
  giftSchema,
  userLoginDetailsSchema,
  userSchema,
} from './zodSchemas';

export type Gift = z.infer<typeof giftSchema>;
export type CreateGift = z.infer<typeof createGiftSchema>;

export type User = z.infer<typeof userSchema>;
export type CreateUser = z.infer<typeof createUserSchema>;

export type UserLoginDetails = z.infer<typeof userLoginDetailsSchema>;

export type CreateSession = z.infer<typeof createSessionSchema>;
