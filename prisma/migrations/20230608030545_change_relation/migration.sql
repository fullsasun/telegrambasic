/*
  Warnings:

  - You are about to drop the column `available` on the `Goods` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Goods` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "GOODS_STATUS" AS ENUM ('AVAILABLE', 'NOTAVAILABLE');

-- AlterTable
ALTER TABLE "Goods" DROP COLUMN "available",
DROP COLUMN "quantity";

-- AlterTable
ALTER TABLE "TagId" ADD COLUMN     "status" "GOODS_STATUS";
