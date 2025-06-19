/*
  Warnings:

  - You are about to drop the column `od` on the `Request` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Request" DROP COLUMN "od",
ADD COLUMN     "odNumber" TEXT NOT NULL DEFAULT '';
