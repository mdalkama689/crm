/*
  Warnings:

  - You are about to drop the column `task` on the `Task` table. All the data in the column will be lost.
  - Added the required column `name` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Task" DROP COLUMN "task",
ADD COLUMN     "attachmentUrl" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "dueDate" TEXT,
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."_TaskAssignment" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TaskAssignment_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_TaskAssignment_B_index" ON "public"."_TaskAssignment"("B");

-- AddForeignKey
ALTER TABLE "public"."_TaskAssignment" ADD CONSTRAINT "_TaskAssignment_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_TaskAssignment" ADD CONSTRAINT "_TaskAssignment_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
