-- CreateTable
CREATE TABLE "public"."SubTask" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "attachmentUrl" TEXT,
    "dueDate" TEXT,
    "createdAt" TEXT,
    "description" TEXT,
    "parentTaskId" TEXT NOT NULL,

    CONSTRAINT "SubTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TaskItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL,
    "subTaskId" TEXT NOT NULL,

    CONSTRAINT "TaskItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."TaskItem" ADD CONSTRAINT "TaskItem_subTaskId_fkey" FOREIGN KEY ("subTaskId") REFERENCES "public"."SubTask"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
