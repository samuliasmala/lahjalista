/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `Gift` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Gift" ADD COLUMN     "uuid" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Gift_uuid_key" ON "Gift"("uuid");
