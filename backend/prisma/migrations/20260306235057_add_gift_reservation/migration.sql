-- AlterTable
ALTER TABLE "Gift" ADD COLUMN     "isReserved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "reservedAt" TIMESTAMP(3),
ADD COLUMN     "reservedByName" TEXT;
