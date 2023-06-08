/*
  Warnings:

  - A unique constraint covering the columns `[tagId]` on the table `Goods` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tagId` to the `Goods` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Goods" ADD COLUMN     "tagId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Goods_tagId_key" ON "Goods"("tagId");
