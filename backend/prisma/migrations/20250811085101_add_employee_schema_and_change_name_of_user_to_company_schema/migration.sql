/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."EmployeeRoles" AS ENUM ('client', 'employee');

-- DropTable
DROP TABLE "public"."User";

-- DropEnum
DROP TYPE "public"."Roles";

-- CreateTable
CREATE TABLE "public"."Company" (
    "id" TEXT NOT NULL,
    "fullname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "role" TEXT NOT NULL DEFAULT 'owner',
    "companyName" TEXT,
    "employeeRange" "public"."EmployeeRange",
    "businessType" TEXT,
    "address" TEXT,
    "isNewsLetterSubscribe" BOOLEAN DEFAULT false,
    "forgotPasswordOtp" TEXT,
    "forgotPasswordExpiry" TIMESTAMP(3),
    "isVerifiedOtp" BOOLEAN DEFAULT false,
    "forgotPasswordUrl" TEXT,
    "forgotPasswordUrlExpiry" TIMESTAMP(3),
    "canRegisterAsOwner" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Employee" (
    "id" TEXT NOT NULL,
    "fullname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "role" "public"."EmployeeRoles" NOT NULL DEFAULT 'employee',
    "companyName" TEXT,
    "isNewsLetterSubscribe" BOOLEAN DEFAULT false,
    "forgotPasswordOtp" TEXT,
    "forgotPasswordExpiry" TIMESTAMP(3),
    "isVerifiedOtp" BOOLEAN DEFAULT false,
    "forgotPasswordUrl" TEXT,
    "forgotPasswordUrlExpiry" TIMESTAMP(3),
    "companyId" TEXT NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_email_key" ON "public"."Company"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_email_key" ON "public"."Employee"("email");

-- AddForeignKey
ALTER TABLE "public"."Employee" ADD CONSTRAINT "Employee_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
