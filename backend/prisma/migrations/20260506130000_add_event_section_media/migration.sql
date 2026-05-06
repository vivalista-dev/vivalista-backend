-- CreateTable
CREATE TABLE IF NOT EXISTS "EventSectionMedia" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "sectionKey" TEXT NOT NULL,
    "mediaRole" TEXT,
    "imageUrl" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "linkUrl" TEXT,
    "buttonLabel" TEXT,
    "metadata" JSONB,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventSectionMedia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "EventSectionMedia_eventId_idx" ON "EventSectionMedia"("eventId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "EventSectionMedia_organizationId_idx" ON "EventSectionMedia"("organizationId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "EventSectionMedia_eventId_sectionKey_idx" ON "EventSectionMedia"("eventId", "sectionKey");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "EventSectionMedia_eventId_sectionKey_displayOrder_idx" ON "EventSectionMedia"("eventId", "sectionKey", "displayOrder");

-- AddForeignKey
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'EventSectionMedia_eventId_fkey'
    ) THEN
        ALTER TABLE "EventSectionMedia"
        ADD CONSTRAINT "EventSectionMedia_eventId_fkey"
        FOREIGN KEY ("eventId") REFERENCES "Event"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- AddForeignKey
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'EventSectionMedia_organizationId_fkey'
    ) THEN
        ALTER TABLE "EventSectionMedia"
        ADD CONSTRAINT "EventSectionMedia_organizationId_fkey"
        FOREIGN KEY ("organizationId") REFERENCES "Organization"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;