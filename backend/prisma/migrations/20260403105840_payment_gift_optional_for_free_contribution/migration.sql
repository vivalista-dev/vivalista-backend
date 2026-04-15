-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_giftId_fkey";

-- AlterTable
ALTER TABLE "Payment" ALTER COLUMN "giftId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_giftId_fkey" FOREIGN KEY ("giftId") REFERENCES "Gift"("id") ON DELETE SET NULL ON UPDATE CASCADE;
