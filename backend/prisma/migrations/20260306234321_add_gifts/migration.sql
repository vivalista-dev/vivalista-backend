-- CreateTable
CREATE TABLE "Gift" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION,
    "imageUrl" TEXT,
    "purchaseUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "eventId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Gift_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Gift" ADD CONSTRAINT "Gift_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
