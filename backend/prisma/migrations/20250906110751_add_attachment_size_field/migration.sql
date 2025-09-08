-- AlterTable
ALTER TABLE "public"."Comment" ADD COLUMN     "attachemntSize" TEXT;

-- AlterTable
ALTER TABLE "public"."Project" ADD COLUMN     "attachmentSize" TEXT;

-- AlterTable
ALTER TABLE "public"."Task" ADD COLUMN     "attachmentSize" TEXT;
