/*
  Warnings:

  - The values [RANGE_1_10,RANGE_10_50,RANGE_50_100,RANGE_100_PLUS] on the enum `EmployeeRange` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."EmployeeRange_new" AS ENUM ('1-10', '10-50', '50-100', '100+');
ALTER TABLE "public"."User" ALTER COLUMN "employeeRange" TYPE "public"."EmployeeRange_new" USING ("employeeRange"::text::"public"."EmployeeRange_new");
ALTER TYPE "public"."EmployeeRange" RENAME TO "EmployeeRange_old";
ALTER TYPE "public"."EmployeeRange_new" RENAME TO "EmployeeRange";
DROP TYPE "public"."EmployeeRange_old";
COMMIT;
