/*
  Warnings:

  - You are about to drop the column `attachmentUrl` on the `SubTask` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `SubTask` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `SubTask` table. All the data in the column will be lost.
  - You are about to drop the column `dueDate` on the `SubTask` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."SubTask" DROP COLUMN "attachmentUrl",
DROP COLUMN "createdAt",
DROP COLUMN "description",
DROP COLUMN "dueDate";
