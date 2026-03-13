-- CreateEnum
CREATE TYPE "GuestStatus" AS ENUM ('INVITED', 'CONFIRMED', 'DECLINED');

-- CreateEnum
CREATE TYPE "GiftStatus" AS ENUM ('AVAILABLE', 'RESERVED', 'PURCHASED');

-- CreateTable
CREATE TABLE "Guest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "status" "GuestStatus" NOT NULL DEFAULT 'INVITED',
    "organizationId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Guest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gift" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "link" TEXT,
    "priceCents" INTEGER,
    "imageUrl" TEXT,
    "status" "GiftStatus" NOT NULL DEFAULT 'AVAILABLE',
    "reservedByName" TEXT,
    "reservedByEmail" TEXT,
    "organizationId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Gift_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Guest_organizationId_idx" ON "Guest"("organizationId");

-- CreateIndex
CREATE INDEX "Guest_eventId_idx" ON "Guest"("eventId");

-- CreateIndex
CREATE INDEX "Guest_organizationId_eventId_idx" ON "Guest"("organizationId", "eventId");

-- CreateIndex
CREATE INDEX "Gift_organizationId_idx" ON "Gift"("organizationId");

-- CreateIndex
CREATE INDEX "Gift_eventId_idx" ON "Gift"("eventId");

-- CreateIndex
CREATE INDEX "Gift_organizationId_eventId_idx" ON "Gift"("organizationId", "eventId");

-- CreateIndex
CREATE INDEX "Event_organizationId_idx" ON "Event"("organizationId");

-- AddForeignKey
ALTER TABLE "Guest" ADD CONSTRAINT "Guest_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guest" ADD CONSTRAINT "Guest_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gift" ADD CONSTRAINT "Gift_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gift" ADD CONSTRAINT "Gift_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
