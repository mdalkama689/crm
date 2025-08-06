-- CreateEnum
CREATE TYPE "public"."EmployeeRange" AS ENUM ('RANGE_1_10', 'RANGE_10_50', 'RANGE_50_100', 'RANGE_100_PLUS');

-- CreateEnum
CREATE TYPE "public"."Roles" AS ENUM ('owner', 'client', 'employee');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "fullname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "role" "public"."Roles" NOT NULL DEFAULT 'employee',
    "companyName" TEXT,
    "employeeRange" "public"."EmployeeRange",
    "businessType" TEXT,
    "address" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");
