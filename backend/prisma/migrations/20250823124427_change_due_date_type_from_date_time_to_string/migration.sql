/*
  Warnings:

  - Made the column `dueDate` on table `Project` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Project" ALTER COLUMN "dueDate" SET NOT NULL,
ALTER COLUMN "dueDate" SET DATA TYPE TEXT;
