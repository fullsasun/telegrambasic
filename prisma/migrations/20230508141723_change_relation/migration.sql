-- DropForeignKey
ALTER TABLE "Goods" DROP CONSTRAINT "Goods_rentId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_rentId_fkey";

-- CreateTable
CREATE TABLE "_GoodsToRent" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_RentToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_GoodsToRent_AB_unique" ON "_GoodsToRent"("A", "B");

-- CreateIndex
CREATE INDEX "_GoodsToRent_B_index" ON "_GoodsToRent"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_RentToUser_AB_unique" ON "_RentToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_RentToUser_B_index" ON "_RentToUser"("B");

-- AddForeignKey
ALTER TABLE "_GoodsToRent" ADD CONSTRAINT "_GoodsToRent_A_fkey" FOREIGN KEY ("A") REFERENCES "Goods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GoodsToRent" ADD CONSTRAINT "_GoodsToRent_B_fkey" FOREIGN KEY ("B") REFERENCES "Rent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RentToUser" ADD CONSTRAINT "_RentToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Rent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RentToUser" ADD CONSTRAINT "_RentToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
