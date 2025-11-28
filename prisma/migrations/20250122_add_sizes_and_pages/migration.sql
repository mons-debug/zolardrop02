-- AlterTable
ALTER TABLE "Variant" ADD COLUMN "size" TEXT;

-- CreateTable
CREATE TABLE "PageContent" (
    "id" TEXT NOT NULL,
    "page" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PageContent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PageContent_page_key" ON "PageContent"("page");

-- Insert default page content
INSERT INTO "PageContent" ("id", "page", "title", "content", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(), 'privacy', 'Privacy Policy', '<h1>Privacy Policy</h1><p>This is the default privacy policy content. Edit this content from the dashboard.</p>', NOW(), NOW()),
  (gen_random_uuid(), 'refund', 'Refund Policy', '<h1>Refund Policy</h1><p>This is the default refund policy content. Edit this content from the dashboard.</p>', NOW(), NOW()),
  (gen_random_uuid(), 'terms', 'Terms of Service', '<h1>Terms of Service</h1><p>This is the default terms of service content. Edit this content from the dashboard.</p>', NOW(), NOW());





