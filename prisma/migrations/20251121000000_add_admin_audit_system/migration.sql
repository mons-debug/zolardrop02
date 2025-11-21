-- Add audit fields to Customer table
ALTER TABLE "Customer" ADD COLUMN "blockedBy" TEXT;
ALTER TABLE "Customer" ADD COLUMN "blockedAt" TIMESTAMP(3);
ALTER TABLE "Customer" ADD COLUMN "updatedBy" TEXT;

-- Add audit fields to Order table
ALTER TABLE "Order" ADD COLUMN "confirmedBy" TEXT;
ALTER TABLE "Order" ADD COLUMN "confirmedAt" TIMESTAMP(3);
ALTER TABLE "Order" ADD COLUMN "shippedBy" TEXT;
ALTER TABLE "Order" ADD COLUMN "shippedAt" TIMESTAMP(3);
ALTER TABLE "Order" ADD COLUMN "deliveredBy" TEXT;
ALTER TABLE "Order" ADD COLUMN "deliveredAt" TIMESTAMP(3);
ALTER TABLE "Order" ADD COLUMN "cancelledBy" TEXT;
ALTER TABLE "Order" ADD COLUMN "cancelledAt" TIMESTAMP(3);
ALTER TABLE "Order" ADD COLUMN "refundedBy" TEXT;
ALTER TABLE "Order" ADD COLUMN "refundedAt" TIMESTAMP(3);
ALTER TABLE "Order" ADD COLUMN "updatedBy" TEXT;

-- Add activity tracking to User table
ALTER TABLE "User" ADD COLUMN "totalActions" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "User" ADD COLUMN "lastActivity" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "AdminAction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "oldValue" TEXT,
    "newValue" TEXT,
    "metadata" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminAction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AdminAction_userId_createdAt_idx" ON "AdminAction"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "AdminAction_entityType_entityId_createdAt_idx" ON "AdminAction"("entityType", "entityId", "createdAt");

-- CreateIndex
CREATE INDEX "AdminAction_action_createdAt_idx" ON "AdminAction"("action", "createdAt");

-- CreateIndex
CREATE INDEX "AdminAction_createdAt_idx" ON "AdminAction"("createdAt");

-- AddForeignKey
ALTER TABLE "AdminAction" ADD CONSTRAINT "AdminAction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

