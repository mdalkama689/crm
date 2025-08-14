-- CreateTable
CREATE TABLE "public"."Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "startDate" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3),
    "assignTo" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "description" TEXT,
    "attachment" TEXT,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);
