/*
  Warnings:

  - A unique constraint covering the columns `[orderNumber]` on the table `Request` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Request" ADD COLUMN     "orderNumber" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Request_orderNumber_key" ON "Request"("orderNumber");
