/*
  Warnings:

  - You are about to drop the column `isNewLetterSubscribe` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "isNewLetterSubscribe",
ADD COLUMN     "forgotPasswordExpiry" TIMESTAMP(3),
ADD COLUMN     "forgotPasswordOtp" INTEGER,
ADD COLUMN     "isNewsLetterSubscribe" BOOLEAN DEFAULT false;
