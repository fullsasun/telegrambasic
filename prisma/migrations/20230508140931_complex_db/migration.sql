-- AlterTable
ALTER TABLE "Goods" ADD COLUMN     "available" INTEGER,
ADD COLUMN     "rentId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "rentId" TEXT;

-- CreateTable
CREATE TABLE "UserActivity" (
    "id" TEXT NOT NULL,
    "user_chat_id" TEXT NOT NULL,
    "activity" TEXT,

    CONSTRAINT "UserActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rent" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER,
    "startRent" TIMESTAMP(3),
    "finishRent" TIMESTAMP(3),

    CONSTRAINT "Rent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserActivity_user_chat_id_key" ON "UserActivity"("user_chat_id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_rentId_fkey" FOREIGN KEY ("rentId") REFERENCES "Rent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Goods" ADD CONSTRAINT "Goods_rentId_fkey" FOREIGN KEY ("rentId") REFERENCES "Rent"("id") ON DELETE SET NULL ON UPDATE CASCADE;
