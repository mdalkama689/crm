/*
  Warnings:

  - Added the required column `enitityId` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `entityType` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."NotificationEntityType" AS ENUM ('TASK', 'PROJECT', 'COMMENT');

-- AlterTable
ALTER TABLE "public"."Notification" ADD COLUMN     "enitityId" TEXT NOT NULL,
ADD COLUMN     "entityType" "public"."NotificationEntityType" NOT NULL;
