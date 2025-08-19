-- AlterTable
ALTER TABLE "public"."Employee" ADD COLUMN     "forgotPasswordExpiry" TIMESTAMP(3),
ADD COLUMN     "forgotPasswordOtp" TEXT;
