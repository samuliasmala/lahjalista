import { Prisma, Gift as PrismaGift } from '@prisma/client';

export type Gift = Omit<PrismaGift, 'id'>;
export type CreateGift = Omit<
  Prisma.GiftCreateInput,
  'uuid' | 'createdAt' | 'updatedAt'
>;
