import { Prisma, Gift as PrismaGift } from '@prisma/client';

export type Gift = Omit<PrismaGift, 'id'>;
