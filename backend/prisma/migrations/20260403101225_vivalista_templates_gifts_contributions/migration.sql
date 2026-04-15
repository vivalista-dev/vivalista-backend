-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('WEDDING', 'KITCHEN_SHOWER', 'BABY_SHOWER', 'BIRTHDAY', 'GRADUATION', 'HOUSEWARMING', 'CORPORATE', 'OTHER');

-- CreateEnum
CREATE TYPE "GiftMode" AS ENUM ('PHYSICAL_ONLY', 'CASH_ONLY', 'HYBRID');

-- CreateEnum
CREATE TYPE "GiftType" AS ENUM ('PHYSICAL', 'CASH', 'QUOTA', 'FREE_CONTRIBUTION');

-- CreateEnum
CREATE TYPE "PriceMode" AS ENUM ('FIXED', 'FLEXIBLE');

-- CreateEnum
CREATE TYPE "GiftStatus" AS ENUM ('AVAILABLE', 'RESERVED', 'PURCHASED', 'PARTIALLY_FUNDED', 'DISABLED');

-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('ACTIVE', 'CANCELLED', 'COMPLETED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "ContributionStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('PIX', 'CARD', 'BOLETO', 'OFFLINE');

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "contributionsFeedEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "eventType" "EventType" NOT NULL DEFAULT 'OTHER',
ADD COLUMN     "freeContributionEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "giftMode" "GiftMode" NOT NULL DEFAULT 'PHYSICAL_ONLY',
ADD COLUMN     "openingMessage" TEXT,
ADD COLUMN     "pixEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "quotaEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "templateKey" TEXT,
ADD COLUMN     "themeKey" TEXT;

-- AlterTable
ALTER TABLE "Gift" ADD COLUMN     "allowCustomAmount" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "category" TEXT,
ADD COLUMN     "displayOrder" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "giftStatus" "GiftStatus" NOT NULL DEFAULT 'AVAILABLE',
ADD COLUMN     "giftType" "GiftType" NOT NULL DEFAULT 'PHYSICAL',
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "maxAmount" DOUBLE PRECISION,
ADD COLUMN     "minAmount" DOUBLE PRECISION,
ADD COLUMN     "priceMode" "PriceMode" NOT NULL DEFAULT 'FIXED',
ADD COLUMN     "quotaSold" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "quotaTotal" INTEGER;

-- CreateTable
CREATE TABLE "EventSection" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "sectionKey" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "configJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventTemplate" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "eventType" "EventType" NOT NULL,
    "previewImage" TEXT,
    "defaultSectionsJson" JSONB,
    "defaultThemeJson" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GiftReservation" (
    "id" TEXT NOT NULL,
    "giftId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "guestId" TEXT,
    "organizationId" TEXT NOT NULL,
    "reservedByName" TEXT NOT NULL,
    "reservedByEmail" TEXT,
    "reservedByPhone" TEXT,
    "status" "ReservationStatus" NOT NULL DEFAULT 'ACTIVE',
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GiftReservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contribution" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "giftId" TEXT,
    "guestId" TEXT,
    "contributorName" TEXT NOT NULL,
    "contributorEmail" TEXT,
    "contributorPhone" TEXT,
    "message" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "status" "ContributionStatus" NOT NULL DEFAULT 'PENDING',
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GiftQuota" (
    "id" TEXT NOT NULL,
    "giftId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "label" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "contributionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GiftQuota_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EventSection_eventId_idx" ON "EventSection"("eventId");

-- CreateIndex
CREATE INDEX "EventSection_organizationId_idx" ON "EventSection"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "EventSection_eventId_sectionKey_key" ON "EventSection"("eventId", "sectionKey");

-- CreateIndex
CREATE UNIQUE INDEX "EventTemplate_key_key" ON "EventTemplate"("key");

-- CreateIndex
CREATE INDEX "GiftReservation_giftId_idx" ON "GiftReservation"("giftId");

-- CreateIndex
CREATE INDEX "GiftReservation_eventId_idx" ON "GiftReservation"("eventId");

-- CreateIndex
CREATE INDEX "GiftReservation_organizationId_idx" ON "GiftReservation"("organizationId");

-- CreateIndex
CREATE INDEX "Contribution_organizationId_idx" ON "Contribution"("organizationId");

-- CreateIndex
CREATE INDEX "Contribution_eventId_idx" ON "Contribution"("eventId");

-- CreateIndex
CREATE INDEX "Contribution_giftId_idx" ON "Contribution"("giftId");

-- CreateIndex
CREATE INDEX "GiftQuota_giftId_idx" ON "GiftQuota"("giftId");

-- CreateIndex
CREATE INDEX "GiftQuota_organizationId_idx" ON "GiftQuota"("organizationId");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_giftId_fkey" FOREIGN KEY ("giftId") REFERENCES "Gift"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventSection" ADD CONSTRAINT "EventSection_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventTemplate" ADD CONSTRAINT "EventTemplate_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GiftReservation" ADD CONSTRAINT "GiftReservation_giftId_fkey" FOREIGN KEY ("giftId") REFERENCES "Gift"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GiftReservation" ADD CONSTRAINT "GiftReservation_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GiftReservation" ADD CONSTRAINT "GiftReservation_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contribution" ADD CONSTRAINT "Contribution_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contribution" ADD CONSTRAINT "Contribution_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contribution" ADD CONSTRAINT "Contribution_giftId_fkey" FOREIGN KEY ("giftId") REFERENCES "Gift"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contribution" ADD CONSTRAINT "Contribution_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GiftQuota" ADD CONSTRAINT "GiftQuota_giftId_fkey" FOREIGN KEY ("giftId") REFERENCES "Gift"("id") ON DELETE CASCADE ON UPDATE CASCADE;
