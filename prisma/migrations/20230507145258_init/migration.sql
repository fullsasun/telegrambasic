-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "user_chat_id" TEXT NOT NULL,
    "nim" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_user_chat_id_key" ON "User"("user_chat_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_nim_key" ON "User"("nim");
