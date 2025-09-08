/*
  Warnings:

  - You are about to drop the column `attachemntSize` on the `Comment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Comment" DROP COLUMN "attachemntSize",
ADD COLUMN     "attachmentSize" TEXT;
