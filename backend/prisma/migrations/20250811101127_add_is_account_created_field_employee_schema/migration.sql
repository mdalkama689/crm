/*
  Warnings:

  - You are about to drop the column `isInvitedUrlUsed` on the `Employee` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Employee" DROP COLUMN "isInvitedUrlUsed",
ADD COLUMN     "isAccountCreated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isInvitedTokenUsed" BOOLEAN NOT NULL DEFAULT false;
