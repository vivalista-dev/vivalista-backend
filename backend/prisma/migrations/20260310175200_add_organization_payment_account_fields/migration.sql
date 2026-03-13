-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "paymentAccountId" TEXT,
ADD COLUMN     "paymentAccountReady" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "paymentAccountStatus" TEXT DEFAULT 'NOT_CONNECTED',
ADD COLUMN     "paymentGateway" TEXT;
