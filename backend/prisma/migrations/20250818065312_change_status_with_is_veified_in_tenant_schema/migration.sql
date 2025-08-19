/*
  Warnings:

  - You are about to drop the column `status` on the `Tenant` table. All the data in the column will be lost.
  - Added the required column `isVerified` to the `Tenant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Tenant" DROP COLUMN "status",
ADD COLUMN     "isVerified" BOOLEAN NOT NULL;
