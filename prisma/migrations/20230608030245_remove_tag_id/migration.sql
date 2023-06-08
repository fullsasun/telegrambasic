/*
  Warnings:

  - You are about to drop the column `tagId` on the `Goods` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tagId]` on the table `TagId` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tagId` to the `TagId` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Goods_tagId_key";

-- AlterTable
ALTER TABLE "Goods" DROP COLUMN "tagId";

-- AlterTable
ALTER TABLE "TagId" ADD COLUMN     "tagId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "TagId_tagId_key" ON "TagId"("tagId");
