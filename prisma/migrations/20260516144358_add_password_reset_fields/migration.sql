/*
  Warnings:

  - A unique constraint covering the columns `[resetTokenHash]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "resetTokenExpiry" TIMESTAMP(3),
ADD COLUMN     "resetTokenHash" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_resetTokenHash_key" ON "users"("resetTokenHash");
