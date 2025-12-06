/*
  Warnings:

  - You are about to drop the column `settlementDare` on the `Transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "settlementDare",
ADD COLUMN     "settlementDate" DATE;
