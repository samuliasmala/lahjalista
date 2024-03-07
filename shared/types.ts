import { Prisma, Gift as PrismaGift } from '@prisma/client';

export type Gift = Omit<PrismaGift, 'id' | 'userUUID'>;
export type CreateGift = Omit<
  Prisma.GiftCreateInput,
  'uuid' | 'createdAt' | 'updatedAt'
>;
