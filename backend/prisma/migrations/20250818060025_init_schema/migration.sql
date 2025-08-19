/*
  Warnings:

  - You are about to drop the column `companyId` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `companyName` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `forgotPasswordExpiry` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `forgotPasswordOtp` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `forgotPasswordUrl` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `forgotPasswordUrlExpiry` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `invitationToken` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `invitationTokenExpiry` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `isAccountCreated` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `isInvited` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `isInvitedTokenUsed` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `isNewsLetterSubscribe` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `isVerified` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `isVerifiedOtp` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the `Company` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Project` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProjectAssignment` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `tenantId` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Employee" DROP CONSTRAINT "Employee_companyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Project" DROP CONSTRAINT "Project_companyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Project" DROP CONSTRAINT "Project_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ProjectAssignment" DROP CONSTRAINT "_ProjectAssignment_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ProjectAssignment" DROP CONSTRAINT "_ProjectAssignment_B_fkey";

-- AlterTable
ALTER TABLE "public"."Employee" DROP COLUMN "companyId",
DROP COLUMN "companyName",
DROP COLUMN "forgotPasswordExpiry",
DROP COLUMN "forgotPasswordOtp",
DROP COLUMN "forgotPasswordUrl",
DROP COLUMN "forgotPasswordUrlExpiry",
DROP COLUMN "invitationToken",
DROP COLUMN "invitationTokenExpiry",
DROP COLUMN "isAccountCreated",
DROP COLUMN "isInvited",
DROP COLUMN "isInvitedTokenUsed",
DROP COLUMN "isNewsLetterSubscribe",
DROP COLUMN "isVerified",
DROP COLUMN "isVerifiedOtp",
ADD COLUMN     "tenantId" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."Company";

-- DropTable
DROP TABLE "public"."Project";

-- DropTable
DROP TABLE "public"."_ProjectAssignment";

-- CreateTable
CREATE TABLE "public"."Tenant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,
    "employeeRange" "public"."EmployeeRange",
    "businessType" TEXT,
    "address" TEXT,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Employee" ADD CONSTRAINT "Employee_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
