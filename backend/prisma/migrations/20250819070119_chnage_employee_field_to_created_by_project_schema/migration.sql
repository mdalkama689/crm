/*
  Warnings:

  - You are about to drop the column `employeeId` on the `Project` table. All the data in the column will be lost.
  - Added the required column `createdBy` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Project" DROP CONSTRAINT "Project_employeeId_fkey";

-- AlterTable
ALTER TABLE "public"."Project" DROP COLUMN "employeeId",
ADD COLUMN     "createdBy" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Project" ADD CONSTRAINT "Project_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
