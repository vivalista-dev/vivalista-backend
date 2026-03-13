-- AlterTable
ALTER TABLE "Gift" ADD COLUMN     "isPurchased" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "purchasedAt" TIMESTAMP(3),
ADD COLUMN     "purchasedByName" TEXT;
