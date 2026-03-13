/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Event` table. All the data in the column will be lost.
  - The `status` column on the `Event` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `updatedAt` on the `Guest` table. All the data in the column will be lost.
  - You are about to drop the `Gift` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Event` will be added. If there are existing duplicate values, this will fail.
  - Made the column `location` on table `Event` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Gift" DROP CONSTRAINT "Gift_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Gift" DROP CONSTRAINT "Gift_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Guest" DROP CONSTRAINT "Guest_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_organizationId_fkey";

-- DropIndex
DROP INDEX "Event_organizationId_idx";

-- DropIndex
DROP INDEX "Guest_eventId_idx";

-- DropIndex
DROP INDEX "Guest_organizationId_eventId_idx";

-- DropIndex
DROP INDEX "Guest_organizationId_idx";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "updatedAt",
ADD COLUMN     "slug" TEXT,
ALTER COLUMN "location" SET NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "Guest" DROP COLUMN "updatedAt";

-- DropTable
DROP TABLE "Gift";

-- DropEnum
DROP TYPE "EventStatus";

-- DropEnum
DROP TYPE "GiftStatus";

-- CreateIndex
CREATE UNIQUE INDEX "Event_slug_key" ON "Event"("slug");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
