/*
  Warnings:

  - Added the required column `isLoggedIn` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "isLoggedIn" BOOLEAN NOT NULL DEFAULT false;
