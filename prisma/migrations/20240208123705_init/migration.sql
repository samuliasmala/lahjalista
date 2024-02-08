-- CreateTable
CREATE TABLE "Gift" (
    "id" SERIAL NOT NULL,
    "receiver" TEXT NOT NULL,
    "gift" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Gift_pkey" PRIMARY KEY ("id")
);
