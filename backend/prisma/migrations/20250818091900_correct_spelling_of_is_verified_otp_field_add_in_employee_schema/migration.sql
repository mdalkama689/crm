/*
  Warnings:

  - You are about to drop the column `isOtpVeified` on the `Employee` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Employee" DROP COLUMN "isOtpVeified",
ADD COLUMN     "isOtpVerified" BOOLEAN NOT NULL DEFAULT false;
