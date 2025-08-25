/*
  Warnings:

  - You are about to drop the column `attachment` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `icon` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Project" DROP COLUMN "attachment",
DROP COLUMN "icon",
ADD COLUMN     "attachmentUrl" TEXT,
ADD COLUMN     "iconUrl" TEXT;
