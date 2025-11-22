-- AlterTable
ALTER TABLE "Variant" ADD COLUMN "sizeInventory" TEXT,
ADD COLUMN "description" TEXT,
ADD COLUMN "showAsProduct" BOOLEAN NOT NULL DEFAULT false;

