/*
  Warnings:

  - Added the required column `startTime` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `startDate` on the `Project` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."Project" ADD COLUMN     "dueTime" TIMESTAMP(3),
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL,
DROP COLUMN "startDate",
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL;
