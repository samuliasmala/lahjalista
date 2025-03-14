/*
  Warnings:

  - The primary key for the `Feedback` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `feedbackID` on the `Feedback` table. All the data in the column will be lost.
  - You are about to drop the column `feedbackUUID` on the `Feedback` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[uuid]` on the table `Feedback` will be added. If there are existing duplicate values, this will fail.
  - The required column `uuid` was added to the `Feedback` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "Gift" DROP CONSTRAINT "Gift_userUUID_fkey";

-- DropIndex
DROP INDEX "Feedback_feedbackUUID_key";

-- AlterTable
ALTER TABLE "Feedback" RENAME COLUMN "feedbackID" TO "id";
ALTER TABLE "Feedback" RENAME COLUMN "feedbackUUID" TO "uuid";
ALTER TABLE "Feedback" DROP CONSTRAINT "Feedback_pkey";
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "Person" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sendReminders" BOOLEAN NOT NULL,
    "userUUID" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Anniversary" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "personUUID" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Anniversary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonPicture" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "thumbnail" BYTEA NOT NULL,
    "picture" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "personUUID" TEXT NOT NULL,

    CONSTRAINT "PersonPicture_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Person_uuid_key" ON "Person"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Anniversary_uuid_key" ON "Anniversary"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "PersonPicture_uuid_key" ON "PersonPicture"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "PersonPicture_personUUID_key" ON "PersonPicture"("personUUID");

-- CreateIndex
CREATE UNIQUE INDEX "Feedback_uuid_key" ON "Feedback"("uuid");

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_userUUID_fkey" FOREIGN KEY ("userUUID") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gift" ADD CONSTRAINT "Gift_userUUID_fkey" FOREIGN KEY ("userUUID") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Anniversary" ADD CONSTRAINT "Anniversary_personUUID_fkey" FOREIGN KEY ("personUUID") REFERENCES "Person"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonPicture" ADD CONSTRAINT "PersonPicture_personUUID_fkey" FOREIGN KEY ("personUUID") REFERENCES "Person"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
