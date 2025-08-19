-- DropForeignKey
ALTER TABLE "public"."Employee" DROP CONSTRAINT "Employee_tenantId_fkey";

-- AlterTable
ALTER TABLE "public"."Employee" ALTER COLUMN "tenantId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Employee" ADD CONSTRAINT "Employee_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
