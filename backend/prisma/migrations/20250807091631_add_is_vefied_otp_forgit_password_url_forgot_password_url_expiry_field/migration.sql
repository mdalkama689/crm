-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "forgotPasswordUrl" TEXT,
ADD COLUMN     "forgotPasswordUrlExpiry" TIMESTAMP(3),
ADD COLUMN     "isVerifiedOtp" BOOLEAN;
