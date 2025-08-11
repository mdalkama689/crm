/*
  Warnings:

  - The `role` column on the `Employee` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `invitationToken` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invitationTokenExpiry` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Employee" ADD COLUMN     "invitationToken" TEXT NOT NULL,
ADD COLUMN     "invitationTokenExpiry" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "isInvited" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isInvitedUrlUsed" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "role",
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'employee';

-- DropEnum
DROP TYPE "public"."EmployeeRoles";
