/*
  Warnings:

  - Made the column `uuid` on table `Gift` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Gift" ALTER COLUMN "uuid" SET NOT NULL;
