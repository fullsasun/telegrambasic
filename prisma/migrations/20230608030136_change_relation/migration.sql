-- CreateTable
CREATE TABLE "TagId" (
    "id" TEXT NOT NULL,
    "goodsId" TEXT,

    CONSTRAINT "TagId_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TagId" ADD CONSTRAINT "TagId_goodsId_fkey" FOREIGN KEY ("goodsId") REFERENCES "Goods"("id") ON DELETE SET NULL ON UPDATE CASCADE;
