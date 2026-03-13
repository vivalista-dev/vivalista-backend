-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "boletoBarcode" TEXT,
ADD COLUMN     "boletoUrl" TEXT,
ADD COLUMN     "checkoutUrl" TEXT,
ADD COLUMN     "externalReference" TEXT,
ADD COLUMN     "gatewayProvider" TEXT,
ADD COLUMN     "paidAt" TIMESTAMP(3),
ADD COLUMN     "pixCode" TEXT,
ADD COLUMN     "pixQrCode" TEXT;
