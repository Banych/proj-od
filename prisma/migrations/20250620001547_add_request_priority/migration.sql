-- CreateEnum
CREATE TYPE "RequestPriority" AS ENUM ('MEDIUM', 'HIGH');

-- AlterTable
ALTER TABLE "Request" ADD COLUMN     "priority" "RequestPriority";
