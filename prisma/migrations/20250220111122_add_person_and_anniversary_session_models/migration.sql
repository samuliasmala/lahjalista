/*
  Warnings:

  - You are about to drop the column `userUUID` on the `Anniversary` table. All the data in the column will be lost.
  - You are about to drop the `ProfilePicture` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[anniversaryUUID]` on the table `Person` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `personUUID` to the `Anniversary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `anniversaryUUID` to the `Person` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Anniversary" DROP CONSTRAINT "Anniversary_userUUID_fkey";

-- DropForeignKey
ALTER TABLE "Person" DROP CONSTRAINT "picture_fk";

-- DropIndex
DROP INDEX "Person_userUUID_key";

-- AlterTable
ALTER TABLE "Anniversary" DROP COLUMN "userUUID",
ADD COLUMN     "personUUID" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Person" ADD COLUMN     "anniversaryUUID" TEXT NOT NULL;

-- DropTable
DROP TABLE "ProfilePicture";

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
CREATE UNIQUE INDEX "PersonPicture_uuid_key" ON "PersonPicture"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "PersonPicture_personUUID_key" ON "PersonPicture"("personUUID");

-- CreateIndex
CREATE UNIQUE INDEX "Person_anniversaryUUID_key" ON "Person"("anniversaryUUID");

-- RenameForeignKey
ALTER TABLE "Person" RENAME CONSTRAINT "user_fk" TO "Person_userUUID_fkey";

-- AddForeignKey
ALTER TABLE "Anniversary" ADD CONSTRAINT "Anniversary_uuid_fkey" FOREIGN KEY ("uuid") REFERENCES "Person"("anniversaryUUID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonPicture" ADD CONSTRAINT "PersonPicture_personUUID_fkey" FOREIGN KEY ("personUUID") REFERENCES "Person"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
