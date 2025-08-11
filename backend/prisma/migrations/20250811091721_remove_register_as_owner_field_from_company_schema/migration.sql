/*
  Warnings:

  - You are about to drop the column `canRegisterAsOwner` on the `Company` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Company" DROP COLUMN "canRegisterAsOwner";
