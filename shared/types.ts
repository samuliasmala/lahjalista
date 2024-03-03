import { Prisma, Gift as PrismaGift } from '@prisma/client';

export type Gift = Omit<PrismaGift, 'id' | 'authorEmail'>;
export type CreateGift = Omit<
  Prisma.GiftCreateInput,
  'uuid' | 'createdAt' | 'updatedAt'
>;
