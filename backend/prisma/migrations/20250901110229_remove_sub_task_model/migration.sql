/*
  Warnings:

  - You are about to drop the column `subTaskId` on the `TaskItem` table. All the data in the column will be lost.
  - You are about to drop the `SubTask` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `taskId` to the `TaskItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."TaskItem" DROP CONSTRAINT "TaskItem_subTaskId_fkey";

-- AlterTable
ALTER TABLE "public"."TaskItem" DROP COLUMN "subTaskId",
ADD COLUMN     "taskId" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."SubTask";

-- AddForeignKey
ALTER TABLE "public"."TaskItem" ADD CONSTRAINT "TaskItem_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "public"."Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
