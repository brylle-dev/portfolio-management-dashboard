/*
  Warnings:

  - You are about to drop the column `fulleName` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "fulleName",
ADD COLUMN     "fullName" TEXT;
