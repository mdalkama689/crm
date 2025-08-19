-- AlterTable
ALTER TABLE "public"."Employee" ADD COLUMN     "invitationLink" TEXT,
ADD COLUMN     "invitationLinkExpireTime" TIMESTAMP(3);
