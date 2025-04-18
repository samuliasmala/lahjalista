-- CreateTable
CREATE TABLE "Gift" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "receiver" TEXT NOT NULL,
    "gift" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Gift_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Gift_uuid_key" ON "Gift"("uuid");
