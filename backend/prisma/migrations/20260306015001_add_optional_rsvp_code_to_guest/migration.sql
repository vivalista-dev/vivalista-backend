/*
  Warnings:

  - A unique constraint covering the columns `[rsvpCode]` on the table `Guest` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Guest" ADD COLUMN     "rsvpCode" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Guest_rsvpCode_key" ON "Guest"("rsvpCode");
