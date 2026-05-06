/*
  Warnings:

  - You are about to drop the `EventSectionMedia` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "EventSectionMedia" DROP CONSTRAINT "EventSectionMedia_eventId_fkey";

-- DropForeignKey
ALTER TABLE "EventSectionMedia" DROP CONSTRAINT "EventSectionMedia_organizationId_fkey";

-- DropTable
DROP TABLE "EventSectionMedia";
